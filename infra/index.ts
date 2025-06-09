import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'
import * as docker from '@pulumi/docker-build'
import * as pulumi from '@pulumi/pulumi'
import cluster from 'cluster'

// Criação do repositório ECR
const ordersECRRepository = new awsx.ecr.Repository('orders-ecr', {
  forceDelete: true
})

// Geração do token de autorização para autenticação no ECR
const ordersECRToken = aws.ecr.getAuthorizationTokenOutput({
  registryId: ordersECRRepository.repository.registryId
})

// Build e push da imagem Docker para o ECR
export const ordersDockerImage = new docker.Image('orders-image', {
  tags: [
    pulumi.interpolate`${ordersECRRepository.repository.repositoryUrl}:latest`
  ],
  context: {
    location: '../app-orders' // Caminho para o diretório com Dockerfile
  },
  push: true,
  platforms: ['linux/amd64'],
  registries: [
    {
      address: ordersECRRepository.repository.repositoryUrl,
      username: ordersECRToken.userName,
      password: ordersECRToken.password
    }
  ]
})

const cluster = new awsx.classic.ecs.Cluster('orders-cluster')

const ordersService = new awsx.classic.ecs.FargateService('orders-service', {
  cluster,
  desiredCount: 1,
  waitForSteadyState: false,
  taskDefinitionArgs: {
    container: {
      image: ordersDockerImage.ref,
      cpu: 256,
      memory: 512,
      essential: true
    }
  }
})
