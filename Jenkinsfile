pipeline {
agent any

environment {
    DOCKER_USERNAME = 'madhu58'
    IMAGE_NAME = 'banking-customer-portal'
    IMAGE_TAG = "${BUILD_NUMBER}"

    AZURE_RESOURCE_GROUP = 'YOUR_RESOURCE_GROUP'
    AZURE_APP_SERVICE = 'bankingportal-prod'

    DOCKER_IMAGE = "${DOCKER_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"
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
            bat "docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${BUILD_NUMBER} ."
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
                bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
            }
        }
    }

    stage('Push Docker Image') {
        steps {
            bat "docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${BUILD_NUMBER}"
        }
    }

    stage('Azure Login') {
        steps {
            withCredentials([
                usernamePassword(
                    credentialsId: 'azure-sp',
                    usernameVariable: 'AZURE_CLIENT_ID',
                    passwordVariable: 'AZURE_CLIENT_SECRET'
                )
            ]) {
                bat """
                az login --service-principal ^
                -u %AZURE_CLIENT_ID% ^
                -p %AZURE_CLIENT_SECRET% ^
                --tenant da18867a-0fca-4bdf-ab69-a96e3a9254f1
                """
            }
        }
    }

    stage('Deploy To Azure App Service') {
        steps {
            bat """
            az webapp config container set ^
            --resource-group %AZURE_RESOURCE_GROUP% ^
            --name %AZURE_APP_SERVICE% ^
            --container-image-name ${DOCKER_USERNAME}/${IMAGE_NAME}:${BUILD_NUMBER}
            """
        }
    }

    stage('Restart App Service') {
        steps {
            bat """
            az webapp restart ^
            --resource-group %AZURE_RESOURCE_GROUP% ^
            --name %AZURE_APP_SERVICE%
            """
        }
    }

    stage('Verify Deployment') {
        steps {
            bat """
            az webapp show ^
            --resource-group %AZURE_RESOURCE_GROUP% ^
            --name %AZURE_APP_SERVICE%
            """
        }
    }
}

post {
    success {
        echo 'Pipeline completed successfully!'
    }

    failure {
        echo 'Pipeline failed!'
    }
}

}
