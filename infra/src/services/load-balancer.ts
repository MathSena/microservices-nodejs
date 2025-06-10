import * as awsx from '@pulumi/awsx'
import { cluster } from './cluster'

// Application Load Balancer (usado para HTTP/HTTPS, ideal para web/painéis)
export const appLoadBalancer = new awsx.classic.lb.ApplicationLoadBalancer(
  'app-lb',
  {
    securityGroups: cluster.securityGroups
  }
)

// Network Load Balancer (para tráfego TCP direto, baixa latência)
export const networkLoadBalancer = new awsx.classic.lb.NetworkLoadBalancer(
  'net-lb',
  {
    subnets: cluster.vpc.publicSubnetIds
  }
)
