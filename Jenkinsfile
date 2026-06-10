pipeline {
    agent any

    stages {

        stage('Pull Code') {
            steps {
                git 'https://github.com/madhusudhan58/banking-customer-portal.git'
            }
        }

        stage('Build') {
            steps {
                bat 'npm install'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t bankingapp .'
            }
        }

        stage('Docker Push') {
            steps {
                bat 'docker push madhu58/bankingapp:v1'
            }
        }

    }
}