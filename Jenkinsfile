pipeline {
    agent any

    environment {
        IMAGE_NAME = "madhu58/banking-customer-portal"
        IMAGE_TAG  = "${BUILD_NUMBER}"

        AZURE_APP_NAME = "bankingportal-prod"
        AZURE_RG       = "banking-rg"
        AZURE_SUBSCRIPTION = "ef57cabf-baa6-4c7c-bb14-538856e1b23a"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/madhusudhan58/banking-customer-portal.git'
            }
        }

        stage('Check Node') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build Application') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Check Docker') {
            steps {
                bat 'docker --version'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {

                    bat '''
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                bat '''
                docker push %IMAGE_NAME%:%IMAGE_TAG%

                docker tag %IMAGE_NAME%:%IMAGE_TAG% %IMAGE_NAME%:latest

                docker push %IMAGE_NAME%:latest
                '''
            }
        }

        stage('Azure Login') {
            steps {

                withCredentials([
                    string(credentialsId: 'azure-client-id', variable: 'AZURE_CLIENT_ID'),
                    string(credentialsId: 'azure-client-secret', variable: 'AZURE_CLIENT_SECRET'),
                    string(credentialsId: 'azure-tenant-id', variable: 'AZURE_TENANT_ID')
                ]) {

                    bat """
                    az login --service-principal ^
                    -u %AZURE_CLIENT_ID% ^
                    -p %AZURE_CLIENT_SECRET% ^
                    --tenant %AZURE_TENANT_ID%

                    az account set --subscription %AZURE_SUBSCRIPTION%
                    """
                }
            }
        }

        stage('Deploy To Azure App Service') {
            steps {

                bat """
                az webapp config container set ^
                --name %AZURE_APP_NAME% ^
                --resource-group %AZURE_RG% ^
                --container-image-name %IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }

        stage('Restart App Service') {
            steps {

                bat """
                az webapp restart ^
                --name %AZURE_APP_NAME% ^
                --resource-group %AZURE_RG%
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                bat """
                az webapp show ^
                --name %AZURE_APP_NAME% ^
                --resource-group %AZURE_RG%
                """
            }
        }
    }

    post {

        success {
            echo 'Docker image built, pushed, and deployed to Azure successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }
    }
}