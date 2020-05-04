import { NextPage } from 'next'

export type CromwellPage<Props> = NextPage<Props & {
    componentsData: any
}>;