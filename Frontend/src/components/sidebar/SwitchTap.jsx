import React, { useMemo, useState } from "react";

const TABS = [
  { id: "all", label: "All" },
  { id: "group", label: "Group" },
  { id: "unread", label: "Unread" },
];
const EMPTY_MESSAGES = {
  all: "No chats yet. Start a new conversation.",
  group: "You are not in any groups yet.",
  unread: "You are all caught up.",
};

const SwitchTap = ({ conversations = [], query = "" }) => {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "unread" && conversation.unread > 0) ||
        (activeTab === "group" && conversation.isGroup);

      const matchesQuery =
        !normalizedQuery ||
        conversation.name.toLowerCase().includes(normalizedQuery) ||
        conversation.lastMessage.toLowerCase().includes(normalizedQuery);

      return matchesTab && matchesQuery;
    });
  }, [activeTab, conversations, query]);
  const emptyText = query
    ? `No results for "${query}".`
    : EMPTY_MESSAGES[activeTab];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    console.log(`Clicked tab: ${tabId}`);
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Conversation filter"
        className="flex justify-center mb-4 w-full space-x-10 bg-slate-800 rounded-lg overflow-hidden px-2 py-1 shadow-sm"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabClick(tab.id)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
                isActive
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {/* Content for the active tab */}
      <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-zinc-500">{emptyText}</p>
        ) : (
          <ul className="space-y-1">
            {filtered.map((chat) => (
              <li key={chat.id}>
                <button
                  type="button"
                  onClick={() => onSelect(chat)}
                  aria-current={chat.id === activeId ? "true" : undefined}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    chat.id === activeId ? "bg-zinc-200" : "hover:bg-zinc-100"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {chat.name}
                    </p>
                    <p className="truncate text-sm text-zinc-500">
                      {chat.lastMessage}
                    </p>
                  </div>

                  {chat.unread > 0 && (
                    <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-semibold text-white">
                      {chat.unread}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SwitchTap;
