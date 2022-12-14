# Outdoor.sy

A website, API, dev-tool show-off, and command-line tool!

![image](https://user-images.githubusercontent.com/759958/184419703-9f4540a5-e10c-4cf1-b572-0e0b634e3301.png)

## CLI Examples

`./cli.js list -s email`

`./cli.js add test1.txt`

`./cli.js add test2.txt`

`./cli.js list --sort last_name`

## Tests

`yarn run tests`

## Hackin'

First, run the development server:

```bash
yarn

yarn dev
```

If you don't like HTTPS for local development, you can also use:

```
yarn http
```


If you want use the containerized stack (requires Kubernetes and Skaffold - works great with Docker Desktop or Rancher Desktop!), you can use:

```
./scripts/k8s.sh
```
