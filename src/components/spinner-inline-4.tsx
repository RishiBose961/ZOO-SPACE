import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

export const title = "Spinner in List Item";

const Example = ({data}: {data: string}) => (
  <Item>
    <Spinner className="text-muted-foreground" />
    <ItemContent>
      <ItemTitle>Loading {data}</ItemTitle>
      <ItemDescription>Please wait while we fetch your data</ItemDescription>
    </ItemContent>
  </Item>
);

export default Example;
