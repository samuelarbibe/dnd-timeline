import { ReloadIcon } from "@radix-ui/react-icons";
import {
	defaultRangeExtractor,
	type Range,
	useVirtualizer,
} from "@tanstack/react-virtual";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import { useAtom, useAtomValue } from "jotai";
import { memo, useCallback, useMemo } from "react";
import { useAutoscroll } from "@/hooks/useAutoscroll";
import { generateItems } from "@/lib/utils";
import { activeAtom, itemsAtom, rowsAtom } from "@/store";
import { Button } from "../ui/button";
import { InlineCode } from "../ui/Inline-code";
import Item from "./item";
import Row from "./row";
import Sidebar from "./sidebar";
import Subrow from "./subrow";

function Timeline() {
	const rows = useAtomValue(rowsAtom);
	const activeItem = useAtomValue(activeAtom);
	const [items, setItems] = useAtom(itemsAtom);
	const { setTimelineRef, style, range, timelineRef } = useTimelineContext();

	useAutoscroll();

	const regenerateItems = () => {
		setItems(generateItems(50, range, rows));
	};

	const groupedSubrows = useMemo(
		() => groupItemsToSubrows(items, range),
		[items, range],
	);

	const activeItemIndex = useMemo(
		() => rows.findIndex((row) => row.id === activeItem?.data.current?.rowId),
		[rows, activeItem],
	);

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		getItemKey: (index) => rows[index].id,
		getScrollElement: () => timelineRef.current,
		rangeExtractor: useCallback(
			(range: Range) => {
				const next = new Set([
					...(activeItemIndex === -1 ? [] : [activeItemIndex]),
					...defaultRangeExtractor(range),
				]);

				return [...next].sort((a, b) => a - b);
			},
			[activeItemIndex],
		),
		estimateSize: (index) => (groupedSubrows[rows[index].id]?.length || 1) * 50,
	});

	return (
		<div className="flex max-w-7xl flex-col w-full gap-3 bg-background">
			<div
				className="select-none rounded-lg border shadow-2xl shadow-slate-900"
				ref={setTimelineRef}
				style={{
					...style,
					maxHeight: 400,
					overflowY: "auto",
					overflowX: "hidden",
				}}
			>
				<div
					style={{
						minHeight: `${rowVirtualizer.getTotalSize()}px`,
						width: "100%",
						overflow: "hidden",
						position: "relative",
					}}
				>
					{rowVirtualizer.getVirtualItems().map((virtualRow) => (
						<div
							key={virtualRow.key}
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								transform: `translateY(${virtualRow.start}px)`,
							}}
						>
							<Row
								id={virtualRow.key as string}
								key={virtualRow.key}
								sidebar={<Sidebar row={rows[virtualRow.index]} />}
							>
								{groupedSubrows[virtualRow.key]?.map((subrow, index) => (
									<Subrow key={`${virtualRow.key}-${index}`}>
										{subrow.map((item) => (
											<Item
												id={item.id}
												key={item.id}
												rowId={item.rowId}
												span={item.span}
											>
												{`Item ${item.id}`}
											</Item>
										))}
									</Subrow>
								))}
							</Row>
						</div>
					))}
				</div>
			</div>
			<div className="flex flex-row items-center gap-2">
				Zoom In / Out:<InlineCode>⌘</InlineCode> +{" "}
				<InlineCode>scroll</InlineCode>
				Move Right / Left:<InlineCode>⌘</InlineCode> +{" "}
				<InlineCode>⇧</InlineCode> + <InlineCode>scroll</InlineCode>
				<div className="flex-1" />
				<Button
					className="self-end gap-2"
					onClick={() => {
						regenerateItems();
					}}
					variant="outline"
				>
					<ReloadIcon />
					Regenerate
				</Button>
			</div>
		</div>
	);
}

export default memo(Timeline);
