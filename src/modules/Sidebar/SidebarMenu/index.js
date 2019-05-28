import React, { useContext, useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Menu, MenuItem } from '@dhis2/ui-core'
import { getCounts } from 'api'
import { Icon } from 'components'
import { ConfigContext, MetadataContext } from 'contexts'
import { CustomMenu } from './style'

/**
 * Sidebar menu.
 */
const SidebarMenu = ({ selected, location, history }) => {
    const { categories, isApproval } = useContext(ConfigContext)
    const { user } = useContext(MetadataContext)
    const [menuItems, setMenuItems] = useState(null)
    const [force, setForce] = useState(false)

    useEffect(() => {
        updateCounts(categories)
    }, [selected, location])

    /**
     * Updates count number in menu.
     */
    const updateCounts = async items => {
        items = await getCounts(items, selected, {
            username: !isApproval ? user.username : false,
            l2Member: user.l2Member,
        })
        items.forEach(
            item =>
                (item.label = item.label.replace(/\(\d*\)/, `(${item.count})`))
        )
        setMenuItems(items)
        setForce(!force)
    }

    return (
        <Menu>
            {(menuItems ? menuItems : categories).map(m => (
                <MenuItem
                    dense
                    key={m.value}
                    value={m.value}
                    onClick={history.push}
                    label={
                        <>
                            <Icon icon={m.icon} />
                            {m.label}
                        </>
                    }
                />
            ))}
        </Menu>
    )
}

export default withRouter(SidebarMenu)
