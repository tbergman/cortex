import { margins, type, colors } from 'styles'
import Link from 'next/link'

export default () => (
  <nav>
    <Link href='/'>
      <img src='static/logo.svg' />
    </Link>
    <div className='items'>
      <Link href='/'>
        <a>Home</a>
      </Link>
      <Link href='/profiles'>
        <a>Profiles</a>
      </Link>
      <Link href='/classes'>
        <a>Classes</a>
      </Link>
      <Link href='/calendar'>
        <a>Calendar</a>
      </Link>
      <Link href='/more'>
        <a>More</a>
      </Link>
    </div>
    <style jsx>{`
      img {
        height: ${margins.m}px;
      }
      a {
        ${type.apercuS} margin-right: ${margins.m}px;
        text-decoration: none;
        color: ${colors.mostlyBlack};
      }
      .items {
        text-align: center;
        flex-grow: 1;
        position: relative;
        top: 3px;
      }
      nav {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: ${margins.m}px;
        background: ${colors.dustyRose};
        z-index: 1;
        padding-right: 112px;
      }
    `}</style>
  </nav>
)
