# OBS for EvntBoard

## Config

```json5
{
  name: "obs", // if no name is provided default value is "obs"
  config: {
    host: "localhost",
    port: 5432,
    password: null,
  },
}
```

## Multiple config

Name property should be different :)
Otherwise you can filter event from the specific source !

```json5
[
  {
    name: "obs-streaming", // if no name is provided default value is "obs"
    config: {
      host: "localhost",
      port: 5432,
      password: null,
    },
  },
  {
    name: "obs-gaming", // if no name is provided default value is "obs"
    config: {
      host: "localhost",
      port: 5431,
      password: "passpls",
    },
  },
]
```
