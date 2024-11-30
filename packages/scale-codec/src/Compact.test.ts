import { describe, expect, it } from '@effect/vitest'
import * as bytes from '@substrate-sdk/bytes'
import { Schema as S } from 'effect'
import * as scaleTS from 'scale-ts'
import { Compact } from './Compact.js'

describe('Compact', () => {
  const encode = S.encodeSync(Compact)
  const encodeUnknown = S.encodeUnknownSync(Compact)
  const decode = S.decodeSync(Compact)
  const decodeEither = S.decodeEither(Compact)

  it.prop('symmetry', [Compact], ([v]) => {
    if (typeof v === 'bigint' && v <= BigInt((1 << 30) - 1)) {
      return Number(v) === decode(encode(v))
    }
    if (typeof v === 'number' && v > BigInt((1 << 30) - 1)) {
      return BigInt(v) === decode(encode(v))
    }

    return v === decode(encode(v))
  })

  it.prop(
    'encode matches scale-ts',
    [Compact],
    ([v]) => bytes.equals(encode(v), scaleTS.compact.enc(v)),
  )

  it.prop(
    'decode matches scale-ts',
    [Compact],
    ([v]) => decode(encode(v)) === scaleTS.compact.dec(encode(v)),
  )

  it.prop(
    'fails to decode empty bytes',
    [S.Uint8ArrayFromSelf.pipe(S.filter((a) => a.byteLength === 0))],
    ([v]) => decodeEither(v)._tag === 'Left',
  )

  it('works for 0', () => {
    expect(encodeUnknown(0)).toEqual(new Uint8Array([0]))
    expect(decode(new Uint8Array([0]))).toEqual(0)
  })

  it.prop(
    'fails for Uint8Arrays that are not representable in scale',
    [S.Number.pipe(S.int(), S.nonNegative(), S.filter((x) => x % 4 !== 0))],
    ([x]) => {
      expect(decodeEither(new Uint8Array([x]))).toMatchObject({ _tag: 'Left' })
    },
  )
})
