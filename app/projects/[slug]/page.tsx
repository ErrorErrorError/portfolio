import Image from 'next/image';
import { ScreenshotOrientation, allProjects } from '@/app/utils/allprojects';
import { notFound } from 'next/navigation';
import { TagsComponent } from '@/app/components/taglist';
import { ExternalLinkButton } from '@/app/components/externalmaterialbutton';

export async function generateStaticParams() {
  const projects = await allProjects();
  return projects.map((p) => ({ slug: p.href.replace('projects/', '"') }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const projects = await allProjects();
  const project = projects.find((v) => v.href.includes(params.slug));
  if (!project) notFound();
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-8 sm:flex-row">
          <div className="flex w-full flex-col sm:self-center">
            <div className="flex flex-row">
              <p className="flex-grow text-3xl font-bold">{project.title}</p>
              {project.externalLink ? (
                <ExternalLinkButton
                  showOpenOn={true}
                  externalLink={project.externalLink}
                />
              ) : (
                <></>
              )}
            </div>
            <p className="pt-1 text-lg font-semibold">Case Study</p>
            <TagsComponent tags={project.tags} />
            <p className="pt-4">{project.description ?? project.shortDescription}</p>
          </div>
        </div>

        {project.screenshots.images.length != 0 ? (
          <>
            <hr className="opacity-10"></hr>
            <div className="flex flex-col gap-4">
              <p className="text-2xl font-bold">Screenshots</p>
              <div
                className={
                  'grid grid-cols-1' +
                  (project.screenshots.orientation ==
                  ScreenshotOrientation.Landscape
                    ? ''
                    : ' gap-4 sm:grid-cols-2 md:grid-cols-3')
                }
              >
                {project.screenshots.images.map((p) => (
                  <Image
                    key={p.alt}
                    className="w-full rounded-3xl"
                    src={p.image}
                    alt={p.alt}
                    placeholder="blur"
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
