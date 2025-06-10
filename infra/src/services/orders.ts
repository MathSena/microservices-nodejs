import * as awsx from '@pulumi/awsx'
import { ordersDockerImage } from '../images/orders'
import { cluster } from './cluster'

export const ordersService = new awsx.classic.ecs.FargateService(
  'orders-service',
  {
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
  }
)
