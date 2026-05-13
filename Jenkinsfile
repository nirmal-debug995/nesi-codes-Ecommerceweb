pipeline {
    agent any

    environment {
        BACKEND_DIR = "02-backend/spring-boot rest api"
        FRONTEND_DIR = "03-frontend/angular-ecommerce"

        JAR_NAME = "spring-boot-ecommerce-0.0.1-SNAPSHOT.jar"

        BACKEND_DEPLOY_PATH = "/home/azureuser/app/backend"
        FRONTEND_DEPLOY_PATH = "/var/www/html"
    }

    stages {

        // =========================
        // Checkout
        // =========================
        stage('Checkout Code') {
            steps {
                git branch: 'uat',
                url: 'https://github.com/nirmal-debug995/nesi-codes-Ecommerceweb.git'
            }
        }

        // =========================
        // Backend Build
        // =========================
        stage('Build Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        // =========================
        // Deploy Backend
        // =========================
        stage('Deploy Backend') {
            steps {
                sh """
                sudo systemctl stop springboot-app || true

                sudo cp "${WORKSPACE}/${BACKEND_DIR}/target/${JAR_NAME}" \
                "${BACKEND_DEPLOY_PATH}/app.jar"

                sudo systemctl start springboot-app

                sudo systemctl status springboot-app --no-pager
                """
            }
        }

        // =========================
        // Frontend Install
        // =========================
        stage('Install Frontend Dependencies') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                }
            }
        }

        // =========================
        // Frontend Build
        // =========================
        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm run build -- --configuration production'
                }
            }
        }

        // =========================
        // Deploy Frontend
        // =========================
        stage('Deploy Frontend') {
            steps {
                sh """
                sudo rm -rf ${FRONTEND_DEPLOY_PATH}/*

                sudo cp -r \
                "${WORKSPACE}/${FRONTEND_DIR}/dist/angular-ecommerce/browser/"* \
                ${FRONTEND_DEPLOY_PATH}/

                sudo systemctl restart nginx
                """
            }
        }
    }

    post {
        success {
            echo 'UAT Deployment Successful!'
        }

        failure {
            echo 'Deployment Failed!'
        }
    }
}
