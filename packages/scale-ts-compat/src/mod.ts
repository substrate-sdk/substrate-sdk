import { decodeHex } from '@substrate-sdk/encoding'
import { Bytes as _Bytes, Compact } from '@substrate-sdk/scale-codec'
import { flow, Schema as S } from 'effect'
import { type Bytes as scaleTsBytes, type Codec, type compact as scaleTsCompact, createCodec } from 'scale-ts'

const toBuffer = (input: string | ArrayBuffer | Uint8Array): Uint8Array => {
  if (input instanceof Uint8Array) return input
  if (typeof input === 'string') return decodeHex(input)
  return new Uint8Array(input)
}

export const Bytes: Codec<Uint8Array> = (createCodec(
  (b) => S.encodeUnknownSync(_Bytes)(b satisfies Uint8Array),
  flow(toBuffer, (b) => S.decodeSync(_Bytes)(b)),
)) satisfies ReturnType<typeof scaleTsBytes>

export const compact: Codec<number | bigint> = (createCodec(
  (v) => S.encodeUnknownSync(Compact)(v satisfies number | bigint),
  flow(toBuffer, (b) => S.decodeSync(Compact)(b)),
)) satisfies typeof scaleTsCompact
