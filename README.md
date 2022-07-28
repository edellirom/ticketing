## ticketing.local (Service)

>1. Build an image for Event Bus (For all Microservices)
>2. Push the image to Docker Hub (You must be logging in docker)
>3. Create a deployment for Event Bus (For all Microservices)
>4. Create a Cluster IP service for Event Bus (For all Microservices)

### Service [auth]

Add/Update docker container and push it to docker hub. (Login to docker application):

`cd auth`

`docker build -t dellirom/auth .`

`docker push dellirom/auth`

(Add others services to docker hum, as example above)

### Restart deployment after docker update

Get all deployments in our cluster. Find in result necessary [deployment_name]:

`kubectl get deployments`

Restart deployment, that was updated, by [deployment_name]

`kubectl rollout restart deployment [deployment_name]`

### Load Balancer

Install ingress-nginx:
[https://kubernetes.github.io/ingress-nginx/deploy/#quick-start]

Course link:
[https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/26492690#overview]

Config for ingress-nginx:

`k8s/ingress-srv.yaml`

### Add microservice to hosts

Open hosts config file

`open /etc/hosts`

Add to config file

`127.0.0.1 ticketing.local`

## Skaffold

### Install skaffold

Official site: [https://skaffold.dev/]

### Run Skaffold

In terminal go to microservice directory `cd ticketing` and then run

`skaffold dev`

or

`skaffold run`

### Use alias k vs kubectl. Add alias in terminal zch. (Mac OS)

Open zch config file

`open ~/.zshrc`

Add alias to config file

`alias k="kubectl"`

# Kubernetes

#### Delete all config files
`kubectl delete -f infra/k8s/`

#### Print out information about all running pods, deployments:
`kubectl get pods`
`kubectl get deployments`

#### Print out some information about the running pod, deployment
`kubectl describe pod [pod_name]`
`kubectl describe  deployment [deployment_name]`

#### Delete the given pod, deployment
`kubectl delete pod [pod_name]`
`kubectl delete deployment [deployment_name]`

#### Delete all pods
`kubectl delete --all pods [--namespace=foo]`

#### Print out logs from the given pod, deployment:
`kubectl logs [pod_name]`
`kubectl logs [deployment_name]`

#### Execute the given command in a running pod:
`kubectl exec -it [pod_name] [cmd]`

#### Print out logs from the given pod
`kubectl logs [pod_name]`

#### Tells Kubernetes to process the config
`kubectl apply -f [config_file_name]`

#### Tell our deployment to use latest version
`kubectl rollout restart deployment [deployment_name]`

#### Forward port
`kubectl port-forwatd [pod_name ]`

#### Use alias in terminal for 
open ~/.zshrc

## Kubernetes secret

### Add kubernetes secret

`kubectl create secret generic jwt-secret --from-literal=JWT_KEY=fasdklskohs`

### Check kubernetes secret

`kubectl get secrets`

### Enter to pod via console
`kubectl exec -it [POD NAME] sh`

## NPM common package

#### Create git repository

`npm publish --access public`

#### If first on PS
`npm adduser` or `npm login`

#### Public package changes

(First need commit changes to git repository)

#### Update package version (Can do it manualy)
`npm version patch`

#### Publish packag changes (You must be login, see above)
`npm publish`


## Payment service
`https://dashboard.stripe.com/test/payments`
