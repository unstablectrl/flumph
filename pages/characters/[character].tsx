import { ArrowLeftIcon } from '@heroicons/react/solid'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Character: NextPage = () => {
  const router = useRouter()
  const { character } = router.query
  return (
    <div>
      <h1>{character}</h1>
      <Link href="/characters">
        <a>
          <ArrowLeftIcon className="w-5 h-5 text-gray-200" />
        </a>
      </Link>
    </div>
  )
}

export default Character
