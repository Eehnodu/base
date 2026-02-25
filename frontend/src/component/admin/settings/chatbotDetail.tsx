import InputBox from "@/component/common/form/inputbox";
import TextareaBox from "@/component/common/form/textareaBox";
import RadioButton from "@/component/common/form/radioButton";
import SelectBox from "@/component/common/form/selectBox";
import Button from "@/component/common/form/button";
import { ChatbotDetailProps, FileSlot } from "@/types/admin/chatbot";
import { useEffect, useRef, useState } from "react";

const responseModelOptions = [
  { label: "gpt-4o", value: "gpt-4o" },
  { label: "gpt-4o-mini", value: "gpt-4o-mini" },
];

const makeId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const ChatbotDetailView = ({
  chatbot,
  onSave,
  onDirtyChange,
}: ChatbotDetailProps) => {
  const [form, setForm] = useState(chatbot);
  const [removedRemoteIds, setRemovedRemoteIds] = useState<string[]>([]);
  const [slots, setSlots] = useState<FileSlot[]>([]);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const onAnyChange = () => onDirtyChange?.(true);

  useEffect(() => {
    setForm(chatbot);
    setRemovedRemoteIds([]);

    const ids = chatbot.vector_file_ids ?? [];
    const names = chatbot.vector_file_names ?? [];

    setSlots(
      ids.length === 0
        ? [{ key: makeId(), file: null, added: false }]
        : ids.map((id, idx) => ({
            key: makeId(),
            remoteId: id,
            remoteName: names[idx] ?? id,
            file: null,
            added: false,
          }))
    );

    onDirtyChange?.(false);
  }, [chatbot]);

  const onPick = (key: string, picked: File | null) => {
    if (!picked) return;

    onAnyChange();

    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.key !== key) return slot;

        if (slot.remoteId) {
          setRemovedRemoteIds((ids) =>
            Array.from(new Set([...ids, slot.remoteId!]))
          );
        }

        return {
          ...slot,
          remoteId: undefined,
          remoteName: undefined,
          file: picked,
        };
      })
    );
  };

  const clearSlotFile = (key: string) => {
    onAnyChange();

    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.key !== key) return slot;

        if (slot.remoteId) {
          setRemovedRemoteIds((ids) =>
            Array.from(new Set([...ids, slot.remoteId!]))
          );
        }

        return {
          ...slot,
          remoteId: undefined,
          remoteName: undefined,
          file: null,
        };
      })
    );

    if (inputRefs.current[key]) inputRefs.current[key]!.value = "";
  };

  const handleSave = () => {
    const isFile = form.data_type === "file";

    const files = isFile
      ? slots.map((s) => s.file).filter((f): f is File => Boolean(f))
      : [];

    const remainingRemote = isFile ? slots.filter((s) => s.remoteId) : [];

    onSave(
      {
        ...form,
        text_data: isFile ? "" : (form.text_data ?? ""),
        vector_file_ids: isFile
          ? remainingRemote.map((s) => s.remoteId!)
          : null,
        vector_file_names: isFile
          ? remainingRemote.map((s) => s.remoteName ?? s.remoteId!)
          : null,
      },
      files,
      removedRemoteIds
    );
  };

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex items-center justify-between gap-2 px-2 py-2">
        <span className="text-base font-bold text-gray-900">챗봇 설정</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-2">
        <div className="flex flex-col gap-4 pb-6">
          {/* 기본 정보 */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-sm font-semibold text-gray-900">
                기본 정보
              </div>
            </div>

            <div className="px-4 py-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-800">
                  챗봇 이름
                </span>
                <div className="pl-2">
                  <InputBox
                    value={form.name}
                    onChange={(v: any) => {
                      onAnyChange();
                      setForm((p) => ({
                        ...p,
                        name:
                          typeof v === "string" ? v : (v?.target?.value ?? ""),
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-800">설명</span>
                <div className="pl-2">
                  <TextareaBox
                    value={form.description}
                    onChange={(v: any) => {
                      onAnyChange();
                      setForm((p) => ({
                        ...p,
                        description:
                          typeof v === "string" ? v : (v?.target?.value ?? ""),
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-800">
                  인사 메시지
                </span>
                <div className="pl-2">
                  <InputBox
                    value={form.greeting_message}
                    onChange={(v: any) => {
                      onAnyChange();
                      setForm((p) => ({
                        ...p,
                        greeting_message:
                          typeof v === "string" ? v : (v?.target?.value ?? ""),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 응답 및 데이터 */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-sm font-semibold text-gray-900">
                응답 및 데이터
              </div>
            </div>

            <div className="px-4 py-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-800">
                  응답 모델
                </span>
                <div className="pl-2">
                  <SelectBox
                    value={form.response_model}
                    options={responseModelOptions}
                    onChange={(value) => {
                      onAnyChange();
                      setForm((p) => ({
                        ...p,
                        response_model: value as string,
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-800">
                  데이터 타입
                </span>
                <div className="pl-2 flex gap-3">
                  <RadioButton
                    label="텍스트"
                    name="data_type"
                    value="text"
                    checked={form.data_type === "text"}
                    onChange={() => {
                      onAnyChange();
                      setForm((p) => ({ ...p, data_type: "text" }));
                    }}
                  />
                  <RadioButton
                    label="파일 데이터"
                    name="data_type"
                    value="file"
                    checked={form.data_type === "file"}
                    onChange={() => {
                      onAnyChange();
                      setForm((p) => ({ ...p, data_type: "file" }));
                    }}
                  />
                </div>
              </div>

              {form.data_type === "text" && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-800">
                    텍스트 데이터
                  </span>
                  <div className="pl-2">
                    <InputBox
                      value={form.text_data ?? ""}
                      onChange={(v: any) => {
                        onAnyChange();
                        setForm((p) => ({
                          ...p,
                          text_data:
                            typeof v === "string"
                              ? v
                              : (v?.target?.value ?? ""),
                        }));
                      }}
                    />
                  </div>
                </div>
              )}

              {form.data_type === "file" && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">
                      파일 데이터
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onAnyChange();
                        setSlots((prev) => [
                          ...prev,
                          { key: makeId(), file: null, added: true },
                        ]);
                      }}
                      className="h-8 w-8 rounded-lg border border-gray-300 bg-white text-sm hover:bg-gray-50 active:bg-gray-100"
                      title="파일 슬롯 추가"
                    >
                      +
                    </button>
                  </div>

                  <div className="pl-2 flex flex-col gap-2">
                    {slots.map((slot) => {
                      const hasRemote = Boolean(slot.remoteId);
                      const hasLocal = Boolean(slot.file);
                      const hasAny = hasRemote || hasLocal;

                      const fileName = hasRemote
                        ? (slot.remoteName ?? slot.remoteId!)
                        : hasLocal
                          ? slot.file!.name
                          : "선택된 파일 없음";

                      const canRemoveRow = slot.added && !hasAny;

                      return (
                        <div
                          key={slot.key}
                          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2"
                        >
                          <input
                            ref={(el) => {
                              inputRefs.current[slot.key] = el;
                            }}
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                              onPick(slot.key, e.target.files?.[0] ?? null)
                            }
                          />

                          <button
                            type="button"
                            onClick={() => inputRefs.current[slot.key]?.click()}
                            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm hover:bg-gray-50 active:bg-gray-100"
                          >
                            {hasAny ? "파일 변경" : "파일 선택"}
                          </button>

                          <div className="flex-1 truncate text-sm text-gray-900">
                            {fileName}
                          </div>

                          {hasAny ? (
                            <button
                              type="button"
                              onClick={() => clearSlotFile(slot.key)}
                              className="h-9 w-9 rounded-lg border border-gray-300 bg-white text-sm hover:bg-gray-50 active:bg-gray-100"
                              title="파일만 제거"
                            >
                              ×
                            </button>
                          ) : canRemoveRow ? (
                            <button
                              type="button"
                              onClick={() => {
                                onAnyChange();
                                setSlots((prev) =>
                                  prev.filter((row) => row.key !== slot.key)
                                );
                                if (inputRefs.current[slot.key])
                                  inputRefs.current[slot.key]!.value = "";
                              }}
                              className="h-9 w-9 rounded-lg border border-gray-300 bg-white text-sm hover:bg-gray-50 active:bg-gray-100"
                              title="행 삭제"
                            >
                              −
                            </button>
                          ) : (
                            <div className="h-9 w-9" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-sm font-semibold text-gray-900">
                안내 메시지
              </div>
            </div>

            <div className="px-4 py-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-800">
                  데이터 찾기 실패 시 안내 문구 사용
                </span>
                <div className="pl-2 flex gap-3">
                  <RadioButton
                    label="사용"
                    name="fallback_type"
                    value="true"
                    checked={form.fallback_type}
                    onChange={() => {
                      onAnyChange();
                      setForm((p) => ({ ...p, fallback_type: true }));
                    }}
                  />
                  <RadioButton
                    label="사용하지 않음"
                    name="fallback_type"
                    value="false"
                    checked={!form.fallback_type}
                    onChange={() => {
                      onAnyChange();
                      setForm((p) => ({ ...p, fallback_type: false }));
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-800">
                  안내 문구
                </span>
                <div className="pl-2">
                  <InputBox
                    value={form.fallback_text}
                    onChange={(v: any) => {
                      onAnyChange();
                      setForm((p) => ({
                        ...p,
                        fallback_text:
                          typeof v === "string" ? v : (v?.target?.value ?? ""),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end px-2 py-2">
        <Button variant="main" size="sm" onClick={handleSave}>
          저장
        </Button>
      </div>
    </div>
  );
};

export default ChatbotDetailView;
