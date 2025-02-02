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

import React, { useEffect, useMemo, useState } from 'react'
import Text from '../../../../components/atoms/text/Text'
import { useMailbox } from '../../../../hooks/mailbox/useMailbox'
import Utils from '../../../../services/Utils'
import styles from './DashboardStoredScreen.module.css'
import { DateTime } from 'luxon'
import { toast } from 'react-toastify'
import WorkingLayout from '../../../../components/layout/working/WorkingLayout'

const DashboardStoredScreen = () => {
  const [{ stored }, { getStoredMessages }] = useMailbox()
  const [isFetchingMessages, setIsFetchingMessages] = useState(true)

  const sortedMessages = useMemo(() => {
    return stored.sort((a, b) => {
      return b?.hash?.time - a?.hash?.time
    })
  }, [stored])

  useEffect(() => {
    getStoredMessages()
      .then(() => {
        setIsFetchingMessages(false)
      })
      .catch(() => {
        toast.error('🔥 Something went wrong while trying to retrieve your stored files :(')
        setIsFetchingMessages(false)
      })
  }, [])

  if (isFetchingMessages) {
    return <WorkingLayout headline="We are getting your data..." />
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.rowWrapper}>
          <div className={styles.header}>
            <Text size="sm" weight="500" variant="black">
              Name
            </Text>
          </div>

          <div className={styles.header} data-tip="Pinned files will be retained by your data provider.">
            <Text size="sm" weight="500" variant="black">
              Pinned
            </Text>
          </div>

          <div className={styles.header}>
            <Text size="sm" weight="500" variant="black">
              Time
            </Text>
          </div>

          <div className={styles.header}>
            <Text size="sm" weight="500" variant="black">
              Size
            </Text>
          </div>
        </div>

        {stored.length > 0 &&
          sortedMessages.map((message) => {
            const { hash = {}, from } = message
            const { file = {} } = hash

            return (
              <div className={styles.rowWrapper} key={message?.hash?.address}>
                <div className={styles.row}>
                  <Text size="sm" variant="black">
                    {file?.name ?? 'Unkown'}
                  </Text>
                </div>

                <div className={styles.row}>
                  <Text size="sm" variant="black">
                    {from ?? 'Unkown'}
                  </Text>
                </div>

                <div className={styles.row}>
                  <Text size="sm" variant="black">
                    {hash.time ? DateTime.fromISO(hash.time).toFormat('dd/LL/yyy HH:mm') : 'Unkown'}
                  </Text>
                </div>

                <div className={styles.row}>
                  <Text size="sm" variant="black">
                    {Utils.humanFileSize(file?.size) ?? 'Unkown'}
                  </Text>
                </div>
              </div>
            )
          })}
        {stored.length === 0 && (
          <div className={styles.row}>
            <Text size="sm" variant="black">
              There is no stored files yet...
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(DashboardStoredScreen)
