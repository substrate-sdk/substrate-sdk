import { describe, it } from '@effect/vitest'
import * as bytes from '@substrate-sdk/bytes'
import { Schema as S } from 'effect'
import * as scaleTS from 'scale-ts'
import { Bytes } from './Bytes.js'

describe('Bytes', () => {
  const encode = S.encodeSync(Bytes)
  const decode = S.decodeSync(Bytes)

  it.prop('symmetry', [Bytes], ([v]) => bytes.equals(v, decode(encode(v))))

  it.prop(
    'decode matches scale-ts',
    [Bytes],
    ([v]) => bytes.equals(decode(encode(v)), scaleTS.Bytes.dec()(encode(v))),
  )

  it.prop(
    'encode matches scale-ts',
    [Bytes],
    ([v]) => bytes.equals(encode(v), scaleTS.Bytes.enc()(v)),
  )
})
