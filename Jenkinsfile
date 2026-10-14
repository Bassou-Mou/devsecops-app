pipeline {
  agent any

  environment {
    IMAGE_NAME = 'devsecops-app'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Test') {
      steps {
        sh '''
          docker build --target test -t ${IMAGE_NAME}-test:${BUILD_NUMBER} -f Dockerfile.test .
          docker run --rm ${IMAGE_NAME}-test:${BUILD_NUMBER}
        '''
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .'
      }
    }
  }

  post {
    success { echo "Build ${BUILD_NUMBER} OK" }
    failure { echo "Build ${BUILD_NUMBER} KO" }
  }
}