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

import * as yup from 'yup'
import { FDSInstance } from '../../../../hooks/mailbox/useMailbox'

export const schema = yup.object().shape({
  mailbox: yup
    .string()
    .required('You must enter a mailbox name.')
    .test('mailboxAvailability', 'Sorry, that name is not available!', (value) => {
      return new Promise((resolve) => {
        if (!value || !FDSInstance.Account.isMailboxNameValid(value)) {
          return resolve(false)
        }
        FDSInstance.Account.isMailboxNameAvailable(value)
          .then((result) => {
            return resolve(result)
          })
          .catch(() => {
            resolve(false)
          })
      })
    }),
  password: yup.string().required('You must enter a password.'),
  passwordConfirmation: yup
    .string()
    .required('You must enter a password.')
    .when('password', {
      is: (val) => (val && val.length > 0 ? true : false),
      then: yup.string().oneOf([yup.ref('password')], 'Passwords must match.'),
    }),
})
