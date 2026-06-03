"use client";

import React, { useEffect, useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import {
  useChains,
  useConfig,
  useConnection,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { type BaseError } from "viem";
import { type NetworkInfo, TESTNET, explorerTxUrl } from "@/components/welcome/networks";
import { formatAddress } from "@/components/welcome/format";
import { Ic } from "@/components/welcome/ui/icons";
import {
  flipperAbi,
  flipperAddressForChain,
  remarkAbi,
  remarkAddressForChain,
} from "@/lib/contracts";
import {
  EYEBROW,
  LIVE_CELL,
  REMARK_MESSAGE,
  WRITE_ACTIONS,
  WRITE_STEPS,
  type WriteActionKey,
} from "@/components/welcome/shared";

interface Props {
  net: NetworkInfo;
  onSwitch: (chainId: number) => void;
}

export function WritePanel({ net, onSwitch }: Props) {
  const config = useConfig();
  const chainReady = useChains().some((c) => c.id === net.chainId);
  const { isConnected, connect } = useWeb3AuthConnect();
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

  const [actionKey, setActionKey] = useState<WriteActionKey>("remark");
  const action = WRITE_ACTIONS[actionKey];

  const contractAddress = actionKey === "flip" ? flipperAddress : remarkAddress;
  const actionBlocked = !contractAddress;
  const actionLabel = actionKey === "flip" ? "flipper.flip" : "system.remark";
  const isTestnet = net.chainId === TESTNET.chainId;
  const missingContractName = actionKey === "flip" ? "flipper" : "remark";

  useEffect(() => {
    reset();
  }, [net.chainId, reset]);

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
      mutate(
        {
          address: flipperAddress,
          abi: flipperAbi,
          functionName: "flip",
          chainId: net.chainId,
        },
        {
          onSuccess: async (hash) => {
            await waitForTransactionReceipt(config, { hash, chainId: net.chainId });
            void refetchFlip();
          },
        },
      );
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

  return (
    <div className={LIVE_CELL}>
      <div className="flex items-center justify-between">
        <span className={EYEBROW}>TRY THE WRITE PATH</span>
        <span className="font-mono text-[11.5px] text-[var(--faint)]">
          signer: {isConnected && address ? formatAddress(address, 8, 4) : "not connected"}
        </span>
      </div>

      <div className="mt-3.5 inline-flex gap-0.5 self-start border border-[var(--line)] p-0.5">
        {Object.values(WRITE_ACTIONS).map((a) => {
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
                <Ic.Arrow className="text-sm transition-transform duration-150 group-hover:translate-x-[3px]" />
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mt-3.5 flex items-start justify-between gap-5 welcome-sm:flex-col welcome-sm:items-stretch welcome-sm:gap-3.5">
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
                className={`inline-flex min-w-[172px] shrink-0 items-center justify-center gap-2 border-[1.5px] border-[var(--acc)] px-[18px] py-[11px] font-mono text-[13px] font-semibold whitespace-nowrap transition-[transform,background,color] duration-150 welcome-sm:w-full ${
                  pending
                    ? "cursor-default bg-transparent text-[var(--acc)] opacity-70"
                    : "cursor-pointer bg-[var(--acc)] text-[var(--paper)] hover:-translate-y-px"
                }`}
              >
                {pending ? "Submitting…" : stage === 3 ? "Run again" : !isConnected ? "Connect to send" : action.cta}
                {!pending && <Ic.Arrow className="text-[15px]" />}
              </button>
            </div>

            <div className="mt-[18px] flex items-center">
              {WRITE_STEPS.map((labelText, i) => {
                const active = stage >= i;
                const pulsing = active && i === stage && pending;
                return (
                  <React.Fragment key={labelText}>
                    <div className="flex items-center gap-1.75">
                      <span
                        className={`inline-block size-[11px] shrink-0 rounded-full border-[1.5px] transition-all duration-200 ${
                          active
                            ? "border-[var(--acc)] bg-[var(--acc)]"
                            : "border-[var(--line)] bg-transparent"
                        } ${pulsing ? "shadow-[0_0_0_4px_color-mix(in_srgb,var(--acc)_22%,transparent)]" : ""}`}
                      />
                      <span
                        className={`font-mono text-[11.5px] transition-colors duration-200 ${active ? "text-[var(--ink)]" : "text-[var(--faint)]"}`}
                      >
                        {labelText}
                      </span>
                    </div>
                    {i < WRITE_STEPS.length - 1 && (
                      <div
                        className={`mx-2.25 h-[1.5px] flex-1 transition-[background] duration-200 ${stage > i ? "bg-[var(--acc)]" : "bg-[var(--line)]"}`}
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
                    <Ic.Check className="text-[13px]" /> Finalized
                  </span>
                  <span className="text-[var(--faint)]">{actionLabel}</span>
                  <a
                    href={explorerTxUrl(net, txHash)}
                    target="_blank"
                    rel="noreferrer"
                    title="View transaction on the block explorer"
                    className="text-[var(--dim)] no-underline transition-colors duration-150 hover:text-[var(--acc)]"
                  >
                    {formatAddress(txHash, 8, 4)}
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
  );
}
