# mollieChat

Custom white-labelled Rocket.Chat source repository.

## Production

- Server: 187.127.156.186
- Public port: 32782
- Source release: 8.6.1
- Source directory: /opt/molliechat-source
- Existing Compose directory: /docker/rocketchat-lipc

## Deployment policy

The production deployment must build a mollieChat Docker image from this
repository. Do not deploy the mutable Rocket.Chat latest image directly.

The existing production container must remain available until the custom image
passes health checks.
