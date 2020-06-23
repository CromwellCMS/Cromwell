import React from 'react';
import { sideBarLinks, SidebarLinkType } from '../../constants/PageInfos';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="Sidebar">
            {sideBarLinks.map(link => <SidebarLink data={link} />)}
        </div>
    )
}

const SidebarLink = (props: { data: SidebarLinkType }) => {
    return (
        <div>
            <Link to={props.data.route} >
                <p>{props.data.title}</p>
            </Link>
            {props.data.sublinks && (
                <div>
                    {props.data.sublinks.map(sublink => {
                        return <SidebarLink data={sublink} />
                    })}
                </div>
            )}
        </div>
    )

}

export default Sidebar;