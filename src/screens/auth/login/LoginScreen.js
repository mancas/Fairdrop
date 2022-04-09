// Copyright 2019 The FairDataSociety Authors
// This file is part of the FairDataSociety library.
//
// The FairDataSociety library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The FairDataSociety library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the FairDataSociety library. If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import Text from '../../../components/atoms/text/Text'
import { routes } from '../../../config/routes'
import { useFormik } from 'formik'
import { schema } from './schema'
import { useMailbox } from '../../../hooks/mailbox/useMailbox'
import { toast } from 'react-toastify'
import { AuthLayout } from '../components/authLayout/AuthLayout'
import { Logo, Box, MetamaskButton, ImportButton, Input, Button } from '../../../components'
import { Link as RNLink } from 'react-router-dom'
import styled from 'styled-components/macro'

const Container = styled(Box)`
  height: 100%;
  box-sizing: border-box;
`

const Header = styled(Box)`
  width: 100%;
`

const StyledLink = styled(RNLink)`
  &&& {
    color: ${({ theme }) => theme?.colors?.primary?.main};
  }
  font-weight: 600;
`

const Content = styled(Box)`
  flex: 1;
  width: 100%;
  max-width: 338px;
  overflow: auto;
`

const StyledLogo = styled(Logo)`
  margin-bottom: 12px;
`

const Headline = styled(Text)`
  margin-bottom: 32px;
`

const Actions = styled(Box)`
  width: 100%;
`

const Separator = styled(Box)`
  width: 100%;

  &:after,
  &:before {
    content: '';
    display: block;
    height: 1px;
    background-color: ${({ theme }) => theme?.colors?.ntrl_light?.main};
    flex: 1;
  }
`

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const SubmitButton = styled(Button)`
  align-self: flex-start;
  margin-top: 8px;
`

const LoginScreen = ({ history, location }) => {
  const [, { unlockMailbox }] = useMailbox()
  const formik = useFormik({
    initialValues: {
      mailbox: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await unlockMailbox(values)

        if (location?.state?.from) {
          history.replace(location?.state?.from)
        } else {
          history.replace(routes.upload.home)
        }
      } catch {
        toast.error('💩 We could not unlock your mailbox. Please check your mailbox name and password')
      }
    },
  })

  // const options = useMemo(() => {
  //   const options = accounts.map((subdomain) => {
  //     return { label: subdomain, value: subdomain }
  //   })

  //   return options
  // }, [accounts])

  // const handleMailboxChange = useCallback(
  //   ({ value }) => {
  //     formik.setFieldTouched('mailbox', true)
  //     formik.setFieldValue('mailbox', value)
  //   },
  //   [formik, handleAddMailbox],
  // )

  return (
    <AuthLayout>
      <Container direction="column" padding="40px" hAlign="center">
        <Header hAlign="right" margin="0 0 24px 0">
          <Text variant="black" size="sm">
            Not a member? <StyledLink to={routes.register}>Sign up</StyledLink>
          </Text>
        </Header>

        <Content direction="column" vAlign="center">
          <StyledLogo size="l" />

          <Headline size="ml" variant="black">
            Log in to your account
          </Headline>

          <Actions gap="8px" direction="column">
            <MetamaskButton disabled />

            <ImportButton />
          </Actions>

          <Separator gap="12px" vAlign="center" margin="30px 0">
            <Text size="sm" variant="black">
              Or
            </Text>
          </Separator>

          <Form onSubmit={formik.handleSubmit}>
            <Input
              name="mailbox"
              value={formik.values.mailbox}
              label="Mailbox"
              placeholder="Type or select your mailbox's name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              hasError={formik.touched?.mailbox && formik.errors?.mailbox}
              errorMessage={formik.errors?.mailbox}
            />

            <Input
              name="password"
              value={formik.values.password}
              label="Password"
              placeholder="Type your password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              hasError={formik.touched?.password && formik.errors?.password}
              errorMessage={formik.errors?.password}
            />

            <SubmitButton type="submit" onClick={formik.handleSubmit} disabled={!formik.isValid || formik.isSubmitting}>
              Log in
            </SubmitButton>
          </Form>
        </Content>
      </Container>
    </AuthLayout>
  )
}

export default React.memo(LoginScreen)
