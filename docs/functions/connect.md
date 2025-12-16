[Lutron LEAP Client](../README.md) / connect

# Function: connect()

> **connect**(`refresh`?, `config`?): [`Client`](../classes/Client.md)

Establishes a connection to all paired devices.

## Parameters

• **refresh?**: `boolean`

(optional) Setting this to true will not load devices from
               cache.

• **config?**: `LeapConfig`

(optional) Configuration for button behavior and other settings.

## Returns

[`Client`](../classes/Client.md)

A reference to the location with all processors.
