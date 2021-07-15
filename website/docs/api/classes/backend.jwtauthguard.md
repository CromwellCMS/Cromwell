[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / JwtAuthGuard

# Class: JwtAuthGuard

[backend](../modules/backend.md).JwtAuthGuard

## Implements

* *CanActivate*

## Table of contents

### Constructors

- [constructor](backend.jwtauthguard.md#constructor)

### Methods

- [canActivate](backend.jwtauthguard.md#canactivate)

## Constructors

### constructor

\+ **new JwtAuthGuard**(`reflector`: *Reflector*): [*JwtAuthGuard*](backend.jwtauthguard.md)

#### Parameters:

Name | Type |
:------ | :------ |
`reflector` | *Reflector* |

**Returns:** [*JwtAuthGuard*](backend.jwtauthguard.md)

Defined in: [system/core/backend/src/helpers/auth-guards.ts:37](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/helpers/auth-guards.ts#L37)

## Methods

### canActivate

▸ **canActivate**(`context`: ExecutionContext): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`context` | ExecutionContext |

**Returns:** *Promise*<boolean\>

Defined in: [system/core/backend/src/helpers/auth-guards.ts:40](https://github.com/CromwellCMS/Cromwell/blob/4b5f538/system/core/backend/src/helpers/auth-guards.ts#L40)
