# Cron for EvntBoard

## Config

```json5
{
  host: "localhost", // EvntBoard HOST
  port: 5001, // Evntboard PORT
  name: "cron", // by default cron
  cron: [
    '* * * * *',
    '* * * * 5',
  ]
}
```