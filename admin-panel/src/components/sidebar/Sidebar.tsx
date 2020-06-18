import React from 'react';
//@ts-ignore
import { pluginsNames } from '.cromwell/importsimports.gen'

type SidebarLinkType = {
    title: string;
    route: string;
    sublinks?: SidebarLinkType[];
}
const links: SidebarLinkType[] = [
    {
        title: 'Home',
        route: ''
    },
    {
        title: 'Plugins',
        route: '/plugins',
        sublinks: pluginsNames.map((name: string) => {
            return {
                title: name,
                route: '/' + name
            }
        })
    }
];

export function Sidebar() {
    return (
        <div>
            {links.map(link => <Link data={link} />)}
        </div>
    )
}

const Link = (props: { data: SidebarLinkType }) => {
    return (
        <div>
            <p>{props.data.title}</p>
            {props.data.sublinks && (
                <div>
                    {props.data.sublinks.map(sublink => {
                        return <Link data={sublink} />
                    })}
                </div>
            )}
        </div>
    )

}
