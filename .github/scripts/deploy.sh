#!/bin/sh
set -e

echo "Deploying application ..."

remove_old_deploy_version() {
    # Remove current version: git_hash/current -> git_hash_current (new)
    echo "Remove old deployed version"
    # Copy old .env file
    echo "Copy environment files"
}

deploy() {
    # Update codebase
    git fetch origin main
    git reset --hard origin/main
    git pull origin main

    cd /var/www/communi-park/

    echo "composer install"
    # Install dependencies based on lock file
    composer install --no-interaction --prefer-dist --optimize-autoloader

    # Migrate database
    php artisan migrate

    # Clear cache

    php artisan optimize:clear

    # Optimize
    php artisan optimize


    # Reload PHP to update opcache
    echo "" | sudo systemctl restart php8.1-fpm
}

deploy

remove_old_deploy_version

echo "Application deployed!"
