import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '../../_components/Button'
import { Gutter } from '../../_components/Gutter'
import { RenderParams } from '../../_components/RenderParams'
import { getMeUser } from '../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import LoginForm from './LoginForm'

import classes from './index.module.scss'

export default async function Login() {
  return (
    <section className={classes.login}>
      <div className={classes.heroImg}>
        <Link href="/">
          {/* <Image src="" alt="logo" width={250} height={23} className={classes.logo} /> */}
        </Link>
      </div>
      <div className={classes.formWrapper}>
        <div className={classes.formContainer}>
          <Button appearance="secondary" href="/" type="button" className={classes.logo}>
            Back
          </Button>
          <RenderParams className={classes.params} />
          <div className={classes.formTitle}>
            <h3>Welcome</h3>
          </div>
          <p>Please login here</p>
          <LoginForm />
        </div>
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login or create an account to get started.',
  openGraph: mergeOpenGraph({
    title: 'Login',
    url: '/login',
  }),
}
