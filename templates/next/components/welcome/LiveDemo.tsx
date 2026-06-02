"use client";

// Live demo of read + write paths against the selected Polkadot Hub chain.
//   • Block watcher — new heads via wagmi useBlock
//   • flipper.flip() / system.remark() — contract calls (addresses in lib/contracts/addresses.ts)
import React, { useEffect, useState } from "react";
import {
  useBlock,
  useChains,
  useConnection,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { type BaseError } from "viem";
import { type NetworkInfo, TESTNET, explorerTxUrl } from "./networks";
import { CLI } from "./data";
import { Ic, LiveDot } from "./icons";
import {
  flipperAbi,
  flipperAddressForChain,
  remarkAbi,
  remarkAddressForChain,
} from "../../lib/contracts";

interface Props {
  acc: string;
  net: NetworkInfo;
  onSwitch: (chainId: number) => void;
}

type ActionKey = "flip" | "remark";

const STEPS = ["Ready", "Broadcast", "InBlock", "Finalized"];
const trunc = (a: string) => `${a.slice(0, 8)}…${a.slice(-4)}`;
const REMARK_MESSAGE = `gm from ${CLI}`;

const eyebrow = "font-mono text-[11px] font-semibold tracking-[0.12em] text-[var(--faint)]";

export function LiveDemo({ acc, net, onSwitch }: Props) {
  const chainReady = useChains().some((c) => c.id === net.chainId);
  const { data: head } = useBlock({
    chainId: chainReady ? net.chainId : undefined,
    watch: chainReady,
    query: { enabled: chainReady },
  });
  const block = head?.number ?? null;
  const hash = head?.hash ?? null;
  const reconnecting = !chainReady || block === null;
  const finalized = block !== null ? block - 3n : null;

  const { isConnected } = useWeb3AuthConnect();
  const { connect } = useWeb3AuthConnect();
  const { address } = useConnection();

  const flipperAddress = flipperAddressForChain(net.chainId);
  const remarkAddress = remarkAddressForChain(net.chainId);

  const { data: flipValue, refetch: refetchFlip } = useReadContract({
    address: flipperAddress,
    abi: flipperAbi,
    functionName: "get",
    chainId: net.chainId,
    query: { enabled: Boolean(flipperAddress && chainReady) },
  });

  const { mutate, data: txHash, error: txError, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const ACTIONS = {
    flip: { key: "flip" as ActionKey, tab: "flipper.flip", title: "Call the flipper contract", cta: "Call contract" },
    remark: { key: "remark" as ActionKey, tab: "system.remark", title: "Submit a sample extrinsic", cta: "Send extrinsic" },
  };
  const [actionKey, setActionKey] = useState<ActionKey>("remark");
  const action = ACTIONS[actionKey];

  const contractAddress = actionKey === "flip" ? flipperAddress : remarkAddress;
  const actionBlocked = !contractAddress;
  const actionLabel = actionKey === "flip" ? "flipper.flip" : "system.remark";
  const isTestnet = net.chainId === TESTNET.chainId;

  useEffect(() => {
    reset();
  }, [net.chainId, reset]);

  useEffect(() => {
    if (isConfirmed && actionKey === "flip") {
      void refetchFlip();
    }
  }, [isConfirmed, actionKey, refetchFlip]);

  const stage = isConfirmed ? 3 : txHash ? 2 : isPending ? 1 : -1;
  const pending = isPending || (!!txHash && isConfirming && !isConfirmed);

  const submit = () => {
    if (pending || actionBlocked) return;
    if (!isConnected || !address) {
      connect();
      return;
    }
    reset();

    if (actionKey === "flip" && flipperAddress) {
      mutate({
        address: flipperAddress,
        abi: flipperAbi,
        functionName: "flip",
        chainId: net.chainId,
      });
      return;
    }

    if (actionKey === "remark" && remarkAddress) {
      mutate({
        address: remarkAddress,
        abi: remarkAbi,
        functionName: "remark",
        args: [REMARK_MESSAGE],
        chainId: net.chainId,
      });
    }
  };

  const missingContractName = actionKey === "flip" ? "flipper" : "remark";

  return (
    <div className="grid grid-cols-2 border-b border-[var(--line)] max-[920px]:grid-cols-1">
      <div className="border-r border-[var(--line)] p-[26px_30px] max-[920px]:border-r-0 max-[920px]:border-b max-[560px]:p-[22px_20px]">
        <div className="flex items-center justify-between">
          <span className={eyebrow}>NETWORK</span>
          <span
            className={`inline-flex items-center gap-2 font-mono text-[11.5px] ${reconnecting ? "text-[var(--faint)]" : "text-[var(--dim)]"}`}
          >
            <LiveDot color={reconnecting ? "var(--faint)" : net.color} />
            {reconnecting ? "connecting…" : "connected"}
          </span>
        </div>

        <div className="mt-[18px] flex items-baseline gap-2.5">
          <span className="font-mono text-[15px] font-semibold text-[var(--acc)]">#</span>
          <span className="inline-block font-mono text-[clamp(36px,5.2vw,52px)] leading-none font-semibold tracking-tight text-[var(--ink)] tabular-nums max-[560px]:text-[clamp(34px,11vw,52px)]">
            {block !== null
              ? Number(block)
                  .toLocaleString("en-US")
                  .split("")
                  .map((ch, i) => (
                    <span key={i + "-" + ch} className="inline-block animate-block-bump">
                      {ch}
                    </span>
                  ))
              : "—"}
          </span>
        </div>
        <div className="mt-2 font-mono text-xs text-[var(--faint)]">
          {hash ? `${hash.slice(0, 10)}…` : "0x…"} · ~3s block time
        </div>

        <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3.5">
          {[
            ["Finalized", finalized !== null ? "#" + Number(finalized).toLocaleString("en-US") : "—"],
            ["Chain", net.chain],
            ["Token", net.token],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="font-mono text-[10.5px] tracking-widest text-[var(--faint)]">{k.toUpperCase()}</div>
              <div className="mt-1 font-mono text-sm text-[var(--ink)]">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-[26px_30px] max-[560px]:p-[22px_20px]">
        <div className="flex items-center justify-between">
          <span className={eyebrow}>TRY THE WRITE PATH</span>
          <span className="font-mono text-[11.5px] text-[var(--faint)]">
            signer: {isConnected && address ? trunc(address) : "not connected"}
          </span>
        </div>

        <div className="mt-3.5 inline-flex gap-0.5 self-start border border-[var(--line)] p-0.5">
          {Object.values(ACTIONS).map((a) => {
            const on = a.key === actionKey;
            return (
              <button
                key={a.key}
                type="button"
                onClick={() => {
                  if (!pending) {
                    setActionKey(a.key);
                    reset();
                  }
                }}
                className={`cursor-pointer border-0 px-3 py-1.5 font-mono text-[11.5px] font-semibold transition-[background,color] duration-150 ${
                  pending && !on ? "cursor-default opacity-50" : ""
                } ${on ? "bg-[var(--acc)] text-[var(--paper)]" : "bg-transparent text-[var(--dim)]"}`}
              >
                {a.tab}
                {a.key === "flip" ? "()" : ""}
              </button>
            );
          })}
        </div>

        <div className="min-h-[130px]">
          {actionBlocked ? (
            <div className="mt-3 border border-dashed border-[var(--line)] px-4 py-3.5">
              <div className="flex items-center gap-2.25">
                <span className="size-1.75 shrink-0 rounded-full bg-[var(--faint)]" />
                <div className="text-[17px] font-semibold tracking-tight text-[var(--ink)]">
                  No {missingContractName} contract on {net.chain}
                </div>
              </div>
              <p className="mt-1.5 mb-0 text-[13px] leading-normal text-[var(--dim)]">
                Run <span className="font-mono text-xs text-[var(--acc)]">npm run deploy:contracts</span> then set{" "}
                <span className="font-mono text-xs text-[var(--acc)]">{missingContractName}</span> in{" "}
                <span className="font-mono text-xs text-[var(--acc)]">lib/contracts/addresses.ts</span> (testnet).
              </p>
              {!isTestnet && (
                <button
                  type="button"
                  onClick={() => onSwitch(TESTNET.chainId)}
                  className="group mt-2.5 inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-mono text-[12.5px] font-semibold whitespace-nowrap text-[var(--acc)]"
                >
                  Switch to {TESTNET.chain}
                  <Ic.arrow className="text-sm transition-transform duration-150 group-hover:translate-x-[3px]" />
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mt-3.5 flex items-start justify-between gap-5 max-[560px]:flex-col max-[560px]:items-stretch max-[560px]:gap-3.5">
                <div className="min-w-0">
                  <div className="text-xl font-semibold tracking-tight text-[var(--ink)]">{action.title}</div>
                  <div className="mt-1.5 font-mono text-[12.5px] text-[var(--dim)]">
                    {actionKey === "flip" ? (
                      <>
                        flipper.flip() · value:{" "}
                        <span className="text-[var(--acc)]">{flipValue === undefined ? "…" : String(flipValue)}</span>
                      </>
                    ) : (
                      <>
                        system.remark(<span className="text-[var(--acc)]">&quot;{REMARK_MESSAGE}&quot;</span>)
                      </>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={submit}
                  disabled={pending}
                  className={`inline-flex min-w-[172px] shrink-0 items-center justify-center gap-2 border-[1.5px] border-[var(--acc)] px-[18px] py-[11px] font-mono text-[13px] font-semibold whitespace-nowrap transition-[transform,background,color] duration-150 max-[560px]:w-full ${
                    pending
                      ? "cursor-default bg-transparent text-[var(--acc)] opacity-70"
                      : "cursor-pointer bg-[var(--acc)] text-[var(--paper)] hover:-translate-y-px"
                  }`}
                >
                  {pending ? "Submitting…" : stage === 3 ? "Run again" : !isConnected ? "Connect to send" : action.cta}
                  {!pending && <Ic.arrow className="text-[15px]" />}
                </button>
              </div>

              <div className="mt-[18px] flex items-center">
                {STEPS.map((labelText, i) => {
                  const active = stage >= i;
                  return (
                    <React.Fragment key={labelText}>
                      <div className="flex items-center gap-1.75">
                        <span
                          className="inline-block size-[11px] shrink-0 rounded-full border-[1.5px] transition-all duration-200"
                          style={{
                            background: active ? acc : "transparent",
                            borderColor: active ? acc : "var(--line)",
                            boxShadow:
                              active && i === stage && pending
                                ? `0 0 0 4px color-mix(in srgb, ${acc} 22%, transparent)`
                                : "none",
                          }}
                        />
                        <span
                          className={`font-mono text-[11.5px] transition-colors duration-200 ${active ? "text-[var(--ink)]" : "text-[var(--faint)]"}`}
                        >
                          {labelText}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className="mx-2.25 h-[1.5px] flex-1 transition-[background] duration-200"
                          style={{ background: stage > i ? acc : "var(--line)" }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="mt-3.5 flex min-h-[22px] flex-col gap-1.5">
                {txError ? (
                  <div className="font-mono text-xs text-[var(--acc)]">
                    {(txError as BaseError).shortMessage || txError.message}
                  </div>
                ) : isConfirmed && txHash ? (
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <span className="inline-flex items-center gap-1.25 font-semibold text-[var(--acc)]">
                      <Ic.check className="text-[13px]" /> Finalized
                    </span>
                    <span className="text-[var(--faint)]">{actionLabel}</span>
                    <a
                      href={explorerTxUrl(net, txHash)}
                      target="_blank"
                      rel="noreferrer"
                      title="View transaction on the block explorer"
                      className="text-[var(--dim)] no-underline transition-colors duration-150 hover:text-[var(--acc)]"
                    >
                      {trunc(txHash)}
                    </a>
                    {receipt && (
                      <span className="ml-auto text-[var(--faint)]">
                        in #{Number(receipt.blockNumber).toLocaleString("en-US")}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="font-mono text-xs text-[var(--faint)]">No extrinsics submitted yet.</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
