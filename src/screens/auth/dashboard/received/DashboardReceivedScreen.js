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

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import Text from '../../../../components/atoms/text/Text'
import { useMailbox } from '../../../../hooks/mailbox/useMailbox'
import { toast } from 'react-toastify'
import WorkingLayout from '../../../../components/layout/working/WorkingLayout'
import Notification from '../../../../components/molecules/notification/Notification'
import styled from 'styled-components/macro'
import { Box } from '../../../../components'
import { TableReceive } from './TableReceived'
import { ListReceived } from './ListReceived'
import { useMediaQuery } from '../../../../hooks/useMediaQuery/useMediaQuery'
import { DEVICE_SIZE } from '../../../../theme/theme'
import { FileDetails } from '../../../../components'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
`

const WrapperTable = styled.div`
  flex: 1;
  padding: 24px 40px 24px 24px;
`

const enterTimeout = 500
const exitTimeout = 250
const enterWidth = '320px'
const exitWidth = '0'

const FileDetailsStyled = styled(FileDetails)``

console.log('paco', FileDetailsStyled.toString())

const WrapperDetails = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: white;
  @media (min-width: ${DEVICE_SIZE.TABLET}) {
    position: static;
    top: unset;
    right: unset;
    bottom: unset;
    left: unset;

    ${FileDetailsStyled} {
      width: ${enterWidth};
    }

    &.wrapper-details-enter {
      width: ${exitWidth};
    }

    &.wrapper-details-enter-active {
      width: ${enterWidth};
      transition: width ${enterTimeout}ms ease-in;
    }

    &.wrapper-details-enter-done {
      width: ${enterWidth};
    }

    &.wrapper-details-exit {
      width: ${enterWidth};
    }

    &.wrapper-details-exit-active {
      width: ${exitWidth};
      transition: width ${exitTimeout}ms ease-out;
    }

    &.wrapper-details-exit-done {
      width: ${exitWidth};
    }
  }
`

const honestInboxRegex = /anonymous-\d{13}/gm

const DashboardReceivedScreen = () => {
  const [{ received }, { getReceivedMessages }] = useMailbox()
  const [isFetchingMessages, setIsFetchingMessages] = useState(true)
  const [shouldOpenNotification, setShouldOpenNotification] = useState(
    !localStorage.getItem('honestInboxDidYouKnowNotification'),
  )
  const [fileDetails, setFileDetails] = useState({
    opened: false,
    data: null,
  })
  const minTabletMediaQuery = useMediaQuery(`(min-width: ${DEVICE_SIZE.TABLET})`)

  const sortedMessages = useMemo(() => {
    return received.sort((a, b) => {
      return b?.hash?.time - a?.hash?.time
    })
  }, [received])

  const onCloseNotification = useCallback(() => {
    localStorage.setItem('honestInboxDidYouKnowNotification', Date.now())
    setShouldOpenNotification(false)
  }, [])

  const handleClickFile = (data) => {
    setFileDetails({
      opened: true,
      data,
    })
  }

  const handleCloseFile = () => {
    setFileDetails((old) => ({
      ...old,
      opened: false,
    }))
  }

  const handleExitedFile = () => {
    setFileDetails((old) => ({
      ...old,
      data: null,
    }))
  }

  useEffect(() => {
    getReceivedMessages()
      .then(() => {
        setIsFetchingMessages(false)
      })
      .catch(() => {
        toast.error('🔥 Something went wrong while trying to retrieve your sent files :(')
        setIsFetchingMessages(false)
      })
  }, [])

  if (isFetchingMessages) {
    return <WorkingLayout headline="We are getting your data..." />
  }

  return (
    <Container>
      <WrapperTable>
        {received.length === 0 ? (
          <Box gap="14px" vAlign="center">
            <Text size="sm" variant="black">
              There is no received files yet...
            </Text>
          </Box>
        ) : (
          <>
            {minTabletMediaQuery ? (
              <TableReceive
                sortedMessages={sortedMessages}
                honestInboxRegex={honestInboxRegex}
                onClick={handleClickFile}
              />
            ) : (
              <ListReceived
                sortedMessages={sortedMessages}
                honestInboxRegex={honestInboxRegex}
                onClick={handleClickFile}
              />
            )}
          </>
        )}
      </WrapperTable>
      <CSSTransition
        in={fileDetails.opened}
        timeout={{
          enter: enterTimeout,
          exit: exitTimeout,
        }}
        classNames={{
          enter: 'wrapper-details-enter',
          enterActive: 'wrapper-details-enter-active',
          enterDone: 'wrapper-details-enter-done',
          exit: 'wrapper-details-exit',
          exitActive: 'wrapper-details-exit-active',
          exitDone: 'wrapper-details-exit-done',
        }}
        onExited={handleExitedFile}
      >
        <WrapperDetails>
          {fileDetails.data && (
            <FileDetailsStyled
              from={fileDetails.data.from}
              file={fileDetails.data.file}
              when={fileDetails.data.time}
              link="wwww.fakelink.org"
              onClose={handleCloseFile}
            />
          )}
        </WrapperDetails>
      </CSSTransition>

      <Notification opened={shouldOpenNotification} onCloseRequest={onCloseNotification}>
        <div>
          <Text weight="500">Hey! Did you know...</Text>
          <Text>
            ...you can use your{' '}
            <Text weight="500" element="span">
              Honest Inbox
            </Text>{' '}
            so people can send you files anonymously?
          </Text>
        </div>
      </Notification>
    </Container>
  )
}

export default React.memo(DashboardReceivedScreen)
