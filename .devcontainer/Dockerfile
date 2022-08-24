# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.238.1/containers/codespaces-linux/.devcontainer/base.Dockerfile

FROM mcr.microsoft.com/vscode/devcontainers/universal:2-focal

# ** [Optional] Uncomment this section to install additional packages. **
USER root
#
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive
RUN npm install -g pnpm

RUN curl -fsSL https://deno.land/install.sh | sh

USER codespace
