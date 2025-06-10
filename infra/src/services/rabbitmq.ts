import * as awsx from '@pulumi/awsx'
import { appLoadBalancer } from './load-balancer' // seu ALB já criado
import { cluster } from './cluster' // ECS Cluster já criado

// Target Group para o painel do RabbitMQ (porta 15672)
const rabbitMQAdminTargetGroup = appLoadBalancer.createTargetGroup(
  'rabbitmq-admin-target',
  {
    port: 15672,
    protocol: 'HTTP',
    healthCheck: {
      path: '/',
      protocol: 'HTTP'
    }
  }
)

// Listener HTTP no ALB para encaminhar requisições ao Target Group
const rabbitMQAdminHttpListener = appLoadBalancer.createListener(
  'rabbitmq-admin-listener',
  {
    port: 15672,
    protocol: 'HTTP',
    targetGroup: rabbitMQAdminTargetGroup
  }
)

// Serviço ECS Fargate do RabbitMQ com acesso via ALB
export const rabbitMQService = new awsx.classic.ecs.FargateService(
  'fargate-rabbitmq',
  {
    cluster,
    desiredCount: 1,
    waitForSteadyState: false,
    taskDefinitionArgs: {
      container: {
        image: 'rabbitmq:3-management',
        cpu: 256,
        memory: 512,
        environment: [
          { name: 'RABBITMQ_DEFAULT_USER', value: 'admin' },
          { name: 'RABBITMQ_DEFAULT_PASS', value: 'admin' }
        ],
        portMappings: [rabbitMQAdminHttpListener]
      }
    }
  }
)
