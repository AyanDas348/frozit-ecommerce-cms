'use client'

import React, { useEffect, useState } from 'react'
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

const carouselImages = [
  '/assets/login-page-images/4_2.jpg',
  '/assets/login-page-images/4_4.jpg',
  '/assets/login-page-images/4_3.jpg',
  // '/assets/login-page-images/4_5.png',
  // '/assets/login-page-images/4_6.png',
]

export default function Login() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % carouselImages.length)
    }, 4000) // Change image every 2 seconds

    return () => clearInterval(interval) // Cleanup interval on component unmount
  }, [])

  return (
    <section className={classes.login}>
      <div className={classes.heroImg}>
        <div className={classes.carouselContainer}>
          {carouselImages.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Carousel image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className={`${classes.carouselImage} ${
                index === currentIndex ? classes.show : classes.hide
              }`}
            />
          ))}
        </div>
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
