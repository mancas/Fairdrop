import React from 'react'
import styled from 'styled-components/macro'
import { List, ListItem, getFileIcon } from '../..'
import { DateTime } from 'luxon'
import Utils from '../../../services/Utils'

const WrapperList = styled(List)`
  width: 100%;
`
export const TableMobile = ({ className, sortedMessages, honestInboxRegex, hideFrom, onClick }) => {
  return (
    <WrapperList className={className}>
      {sortedMessages.map((message) => {
        const { hash = {}, from } = message
        const { file = {} } = hash

        let sanitizedFrom = from
        if (new RegExp(honestInboxRegex).test(from)) {
          sanitizedFrom = 'Honest Inbox'
        }

        const subtitleArr = [
          !hideFrom ? sanitizedFrom : undefined,
          hash.time ? DateTime.fromMillis(hash.time).toFormat('dd/LL/yyyy') : 'Unkown',
          Utils.humanFileSize(file?.size) ?? 'Unkown',
        ].filter((item) => !!item)

        return (
          <ListItem
            key={message?.hash?.address}
            iconName={getFileIcon({ type: file.type })?.name}
            title={sanitizedFrom ?? 'Unkown'}
            subtitle={subtitleArr.join(' · ')}
            onClick={() => onClick?.({ file, from, time: hash.time })}
          />
        )
      })}
    </WrapperList>
  )
}
