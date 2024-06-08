import { ExternalLinkIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button, Flex, Heading, Link, Text } from "@radix-ui/themes";

import BackgroundImage from "./components/BackgroundImage";
import Timeline from "./components/timeline/Timeline";
import TimelineWrapper from "./components/timeline/TimelineWrapper";

function App() {
	return (
		<TimelineWrapper>
			<Flex
				direction="row"
				gap="9"
				grow="1"
				p="9"
				style={{ justifyContent: "space-around" }}
				wrap="wrap"
			>
				<Flex
					align="center"
					inset="0"
					justify="center"
					position="absolute"
					style={{ overflow: "hidden", zIndex: -999 }}
				>
					<BackgroundImage id="music" />
				</Flex>
				<Flex align="center" direction="column" justify="center">
					<Flex direction="column" gap="2" justify="start">
						<Heading as="h1" size="9">
							🎉&nbsp;&nbsp;dnd-timeline
						</Heading>
						<Text color="gray" size="6" weight="medium">
							A headless timeline library for React, based on &nbsp;
							<Link href="https://dndkit.com/" target="#">
								dnd-kit
							</Link>
							.
						</Text>
						<Flex direction="row" gap="2" justify="start" mt="4">
							<Link
								href="https://samuel-arbibe.gitbook.io/dnd-timeline/"
								target="#"
							>
								<Button size="4">
									Documentation <ExternalLinkIcon />
								</Button>
							</Link>
							<Link href="https://github.com" target="#">
								<Button color="gray" size="4" variant="soft">
									GitHub <GitHubLogoIcon />
								</Button>
							</Link>
						</Flex>
					</Flex>
				</Flex>
				<Flex
					direction="column"
					grow="1"
					justify="center"
					style={{ maxWidth: 1200, minWidth: 400 }}
				>
					<Timeline />
				</Flex>
			</Flex>
		</TimelineWrapper>
	);
}

export default App;
