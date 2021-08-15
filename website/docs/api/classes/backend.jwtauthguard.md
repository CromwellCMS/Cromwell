[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / JwtAuthGuard

# Class: JwtAuthGuard

[backend](../modules/backend.md).JwtAuthGuard

## Implements

- `CanActivate`

## Table of contents

### Constructors

- [constructor](#constructor)

### Methods

- [canActivate](#canactivate)

## Constructors

### constructor

• **new JwtAuthGuard**(`reflector`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `reflector` | `Reflector` |

#### Defined in

[system/core/backend/src/helpers/auth-guards.ts:38](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/auth-guards.ts#L38)

## Methods

### canActivate

▸ **canActivate**(`context`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `ExecutionContext` |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

CanActivate.canActivate

#### Defined in

[system/core/backend/src/helpers/auth-guards.ts:40](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/auth-guards.ts#L40)
