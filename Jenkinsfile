pipeline {
    agent any

    environment {
        ACR = "ecommerceacrprod.azurecr.io"
        IMAGE_TAG = "${BUILD_NUMBER}"
        RESOURCE_GROUP = "ecommerce-aks-rg"
        AKS_CLUSTER = "ecommerce-aks"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Azure Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'azure-sp',
                        usernameVariable: 'APP_ID',
                        passwordVariable: 'APP_SECRET')]) {

                    sh '''
                        az login --service-principal \
                        -u $APP_ID \
                        -p $APP_SECRET \
                        --tenant "df78f0d9-308a-45ae-9bd1-43cf3427e97c"

                        az account show
                    '''
                }
            }
        }

        stage('ACR Login') {
            steps {
                sh '''
                    az acr login --name ecommerceacrprod
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('02-backend/spring-boot rest api') {
                    sh '''
                        docker build -t $ACR/ecommerce-backend:$IMAGE_TAG .
                    '''
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('03-frontend/angular-ecommerce') {
                    sh '''
                        docker build -t $ACR/ecommerce-frontend:$IMAGE_TAG .
                    '''
                }
            }
        }

        stage('Push Images to ACR') {
            steps {
                sh '''
                    docker push $ACR/ecommerce-backend:$IMAGE_TAG
                    docker push $ACR/ecommerce-frontend:$IMAGE_TAG
                '''
            }
        }

        stage('Get AKS Credentials') {
            steps {
                sh '''
                    az aks get-credentials \
                        --resource-group $RESOURCE_GROUP \
                        --name $AKS_CLUSTER \
                        --overwrite-existing
                '''
            }
        }

        stage('Deploy to AKS') {
            steps {
                sh '''
                    kubectl set image deployment/ecommerce-backend \
                        backend=$ACR/ecommerce-backend:$IMAGE_TAG \
                        -n ecommerce

                    kubectl set image deployment/ecommerce-frontend \
                        frontend=$ACR/ecommerce-frontend:$IMAGE_TAG \
                        -n ecommerce

                    kubectl rollout status deployment/ecommerce-backend -n ecommerce
                    kubectl rollout status deployment/ecommerce-frontend -n ecommerce
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline executed successfully!'
        }

        failure {
            echo '❌ Pipeline failed — check logs'
        }
    }
}
