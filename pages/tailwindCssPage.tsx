import styles from '@/styles/TailwindPage.module.css';

import { gql, useQuery } from '@apollo/client';
import { getAllTools } from '@/graphql/queries';
import { Tool } from '@/lib/dump-data/types';

export default function TailwindPage(props: {}) {
  const { loading, error, data } = useQuery(getAllTools);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error :(
        {error.message}
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="text-3xl text-center my-4">Tools</h1>
      <ul className="flex-1">
        {data?.getTools?.map((tool: Tool) => (
          <li key={tool.id} className="w-full mb-3 p-2">
            {tool.name} : {tool.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
