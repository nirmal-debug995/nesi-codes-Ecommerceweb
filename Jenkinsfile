pipeline {
    agent any

    environment {
        ACR = "ecommerceacrprod.azurecr.io"
        IMAGE_TAG = "${BUILD_NUMBER}"
        RESOURCE_GROUP = "ecommerce-aks-rg"
        AKS_CLUSTER = "ecommerce-aks"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Azure Login') {
            steps {
                withCredentials([string(credentialsId: 'azure-sp', variable: 'AZURE_CRED')]) {
                    sh '''
                        echo $AZURE_CRED > azure.json
                        az login --service-principal --username <appId> --password <password> --tenant <tenantId>
                    '''
                }
            }
        }

        stage('ACR Login') {
            steps {
                sh "az acr login --name ecommerceacrprod"
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    docker build -t $ACR/ecommerce-backend:$IMAGE_TAG ./02-backend/spring-boot\ rest\ api
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    docker build -t $ACR/ecommerce-frontend:$IMAGE_TAG ./03-frontend/angular-ecommerce
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                    docker push $ACR/ecommerce-backend:$IMAGE_TAG
                    docker push $ACR/ecommerce-frontend:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy to AKS') {
            steps {
                sh '''
                    az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_CLUSTER --overwrite-existing

                    kubectl set image deployment/ecommerce-backend backend=$ACR/ecommerce-backend:$IMAGE_TAG -n ecommerce
                    kubectl set image deployment/ecommerce-frontend frontend=$ACR/ecommerce-frontend:$IMAGE_TAG -n ecommerce

                    kubectl rollout status deployment/ecommerce-backend -n ecommerce
                    kubectl rollout status deployment/ecommerce-frontend -n ecommerce
                '''
            }
        }
    }
}
