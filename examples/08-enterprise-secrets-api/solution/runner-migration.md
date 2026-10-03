# Migration key

1. Confirm the image migration in the job's installed-software log and `actions/runner-images` release/readme material.
2. Temporarily select the documented older image label only if it is still supported and policy permits; do not assume indefinite availability.
3. Make the required compiler/tool version explicit through a reviewed setup action, package manager, container, or curated self-hosted image.
4. Test the new image/version in a matrix or canary, update assertions/caches, then remove the temporary compatibility pin.

