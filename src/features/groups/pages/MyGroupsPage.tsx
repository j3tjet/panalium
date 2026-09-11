import { Button, EmptyState, Page, PageHeader } from "@/shared/ui"
import { useNavigation } from "@/app/navigation"
import { useCurrentUser } from "@/features/auth"
import { useMyGroups } from "../hooks/useGroups"
import MyGroupCard from "../components/MyGroupCard"

export default function MyGroupsPage() {
  const user = useCurrentUser()
  const { navigate } = useNavigation()
  const myGroups = useMyGroups()

  return (
    <Page width="lg">
      <PageHeader
        title="Mis Panales"
        description="Los Panales que fundaste o donde vuelas con otras Abejas."
        actions={
          <Button onClick={() => navigate("create-group")}>
            Fundar un Panal
          </Button>
        }
      />
      {myGroups.length === 0 ? (
        <EmptyState
          title="Aún no tienes Panales"
          description="Toda colmena empieza con una Abeja: funda el primero o únete a uno abierto."
          action={
            <Button
              variant="secondary"
              onClick={() => navigate("marketplace-groups")}
            >
              Explorar Panales
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {myGroups.map((g) => (
            <MyGroupCard
              key={g.id}
              group={g}
              userId={user.id}
              onClick={() => navigate("marketplace-groups")}
            />
          ))}
        </div>
      )}
    </Page>
  )
}
