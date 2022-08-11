#!/usr/bin/env bash
set -e

USAGE="./repl.sh \"[target]\""
TARGET="${1:-dev}"

NODE_CMD="node --experimental-repl-await scripts/repl.js"

if [[ "$TARGET" == "local" ]]; then
  set -a
  [ -f '.env' ] && source '.env'
  set +a
  ${NODE_CMD}
else
  POD_NAME="$(kubectl get pods -l app=api -o name | awk -F'/' '{print $2}' | head -n1)"
  [[ -z $POD_NAME ]] && {
    echo -e "No API pod in current context" && exit 1
  }
  kubectl exec -it ${POD_NAME} \
    -- \
    bash -c "${NODE_CMD}"
fi
