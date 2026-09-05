(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/commerce/SizeGuideModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SizeGuideModal",
    ()=>SizeGuideModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sizing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sizing.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function SizeGuideModal({ sizeChart, isOpen, onClose }) {
    _s();
    const [unit, setUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("INCHES");
    if (!isOpen) return null;
    const sizes = [
        "S",
        "M",
        "L",
        "XL"
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "size-guide-title",
        style: {
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
        },
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                background: "#ffffff",
                color: "#111111",
                maxWidth: "580px",
                width: "100%",
                padding: "32px",
                borderRadius: "2px",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
                fontFamily: "var(--font-space-mono), monospace"
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "20px",
                        borderBottom: "2px solid #111",
                        paddingBottom: "12px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: "10px",
                                        color: "#666",
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase",
                                        fontWeight: 700
                                    },
                                    children: "FIT & MEASUREMENTS"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    id: "size-guide-title",
                                    style: {
                                        margin: "4px 0 0 0",
                                        fontSize: "18px",
                                        fontWeight: 800,
                                        letterSpacing: "-0.02em"
                                    },
                                    children: sizeChart.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            style: {
                                background: "#f0f0f0",
                                border: 0,
                                color: "#111",
                                fontSize: "14px",
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontWeight: 700
                            },
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: "16px",
                        gap: "4px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setUnit("INCHES"),
                            style: {
                                padding: "4px 10px",
                                fontSize: "11px",
                                fontWeight: 700,
                                background: unit === "INCHES" ? "#111" : "#f4f4f4",
                                color: unit === "INCHES" ? "#fff" : "#666",
                                border: 0,
                                cursor: "pointer"
                            },
                            children: "INCHES"
                        }, void 0, false, {
                            fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setUnit("CM"),
                            style: {
                                padding: "4px 10px",
                                fontSize: "11px",
                                fontWeight: 700,
                                background: unit === "CM" ? "#111" : "#f4f4f4",
                                color: unit === "CM" ? "#fff" : "#666",
                                border: 0,
                                cursor: "pointer"
                            },
                            children: "CM"
                        }, void 0, false, {
                            fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    style: {
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "12px",
                        marginBottom: "20px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                style: {
                                    background: "#f8f8f8",
                                    borderBottom: "2px solid #111"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: "left",
                                            padding: "10px 12px",
                                            fontWeight: 800
                                        },
                                        children: "SIZE"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                        lineNumber: 115,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: "right",
                                            padding: "10px 12px",
                                            fontWeight: 800
                                        },
                                        children: "CHEST"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                        lineNumber: 116,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: "right",
                                            padding: "10px 12px",
                                            fontWeight: 800
                                        },
                                        children: "LENGTH"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                        lineNumber: 117,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: "right",
                                            padding: "10px 12px",
                                            fontWeight: 800
                                        },
                                        children: "SHOULDER"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: "right",
                                            padding: "10px 12px",
                                            fontWeight: 800
                                        },
                                        children: "SLEEVE"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                        lineNumber: 119,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: sizes.map((s)=>{
                                const m = sizeChart.measurements[s] || {
                                    chest: 0,
                                    length: 0,
                                    shoulder: 0,
                                    sleeve: 0
                                };
                                const val = (inch)=>unit === "INCHES" ? `${inch}"` : `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sizing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inchesToCm"])(inch)} cm`;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    style: {
                                        borderBottom: "1px solid #e5e5e5"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                padding: "12px",
                                                fontWeight: 800
                                            },
                                            children: s
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                            lineNumber: 129,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                textAlign: "right",
                                                padding: "12px"
                                            },
                                            children: val(m.chest)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                            lineNumber: 130,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                textAlign: "right",
                                                padding: "12px"
                                            },
                                            children: val(m.length)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                            lineNumber: 131,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                textAlign: "right",
                                                padding: "12px"
                                            },
                                            children: val(m.shoulder)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                            lineNumber: 132,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                textAlign: "right",
                                                padding: "12px"
                                            },
                                            children: val(m.sleeve)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                            lineNumber: 133,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, s, true, {
                                    fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                                    lineNumber: 128,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                    lineNumber: 112,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: "#f8f8f8",
                        padding: "14px 16px",
                        fontSize: "11px",
                        color: "#555",
                        lineHeight: 1.6,
                        borderLeft: "3px solid #111"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: "FIT ADVICE:"
                        }, void 0, false, {
                            fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                            lineNumber: 141,
                            columnNumber: 11
                        }, this),
                        " Engineered with a structured boxy streetwear drape. For an intended oversized fit, order your true size. For a standard tailored fit, size down by one."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/commerce/SizeGuideModal.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_s(SizeGuideModal, "GhuLaM6Fb+ClQXV+CTBxusFI7AE=");
_c = SizeGuideModal;
var _c;
__turbopack_context__.k.register(_c, "SizeGuideModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/experience/ProductPageRenderer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductPageRenderer",
    ()=>ProductPageRenderer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sizing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sizing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$navigation$2f$GlobalHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/navigation/GlobalHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$navigation$2f$StorefrontFooter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/navigation/StorefrontFooter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$MovableBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/hero/MovableBackground.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$HeroProduct3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/hero/HeroProduct3D.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$commerce$2f$SizeGuideModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/commerce/SizeGuideModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function track(event, properties) {
    try {
        if ("TURBOPACK compile-time truthy", 1) {
            fetch("/api/analytics/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    event,
                    properties,
                    timestamp: Date.now()
                })
            }).catch(()=>{});
        }
    } catch  {
    // Ignore tracking errors
    }
}
const VIEWS = [
    {
        id: "FRONT",
        label: "Front View"
    },
    {
        id: "BACK",
        label: "Back View"
    },
    {
        id: "LEFT SLEEVE",
        label: "Left Sleeve"
    },
    {
        id: "RIGHT SLEEVE",
        label: "Right Sleeve"
    },
    {
        id: "PRINT",
        label: "Graphic Print"
    }
];
function ProductPageRenderer({ product }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [selectedSize, setSelectedSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("M");
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("FRONT");
    const [isSizeGuideOpen, setIsSizeGuideOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [cartCount, setCartCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Parallax Pointer Signal (Subtle, restrained depth)
    const [signal, setSignal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 50,
        y: 50
    });
    function handlePointerMove(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 100;
        const y = (e.clientY - rect.top) / rect.height * 100;
        setSignal({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y))
        });
    }
    const isLive = product.launch?.status === "LIVE";
    const isPaused = product.launch?.status === "PAUSED";
    const isPrebook = isLive && (product.launch?.purchaseMode === "PREBOOK" || product.purchaseMode === "PREBOOK");
    const isBuyNow = isLive && (product.launch?.purchaseMode === "BUY_NOW" || product.purchaseMode === "BUY_NOW");
    async function handleAddToCart(isInstantCheckout) {
        if (isProcessing) return;
        setIsProcessing(true);
        const purchaseMode = isPrebook ? "PREBOOK" : "BUY_NOW";
        // 1. Local Storage Cart Update
        try {
            const rawCart = window.localStorage.getItem("bexyee_cart");
            const cartItems = rawCart ? JSON.parse(rawCart) : [];
            const existingIndex = cartItems.findIndex((item)=>item.productId === product.id && item.size === selectedSize);
            if (existingIndex > -1) {
                cartItems[existingIndex].quantity += 1;
                cartItems[existingIndex].purchaseMode = purchaseMode;
            } else {
                cartItems.push({
                    productId: product.id,
                    productName: product.name,
                    size: selectedSize,
                    quantity: 1,
                    unitPricePaise: product.pricePaise,
                    sku: product.sku,
                    purchaseMode,
                    expectedFulfillmentDate: product.prebookConfig?.expectedFulfillmentDate
                });
            }
            window.localStorage.setItem("bexyee_cart", JSON.stringify(cartItems));
            const totalUnits = cartItems.reduce((acc, i)=>acc + i.quantity, 0);
            setCartCount(totalUnits);
        } catch  {
        // LocalStorage fallback
        }
        // 2. Server-side cart synchronization
        try {
            const guestToken = window.localStorage.getItem("bexyee_guest_token") || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "guest_" + Date.now());
            window.localStorage.setItem("bexyee_guest_token", guestToken);
            const cartRes = await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: product.id,
                    size: selectedSize,
                    quantity: 1,
                    purchaseMode
                })
            });
            const cartData = await cartRes.json().catch(()=>null);
            if (cartData?.id) {
                window.localStorage.setItem("bexyee_cart_id", cartData.id);
            }
        } catch  {
        // Graceful fallback
        }
        track(isPrebook ? "prebook_initiated" : "add_to_cart", {
            size: selectedSize,
            quantity: 1,
            buyNow: isInstantCheckout,
            purchaseMode
        });
        if (isInstantCheckout) {
            track("checkout_started", {
                size: selectedSize,
                purchaseMode
            });
            router.push("/checkout");
        } else {
            setIsProcessing(false);
            setMessage(`✓ ${selectedSize} / ${product.name} added to bag`);
            setTimeout(()=>setMessage(""), 3500);
        }
    }
    const viewPhotos = {
        FRONT: product.assets.frontImage,
        BACK: product.assets.backImage,
        "LEFT SLEEVE": product.assets.leftSleeveImage,
        "RIGHT SLEEVE": product.assets.rightSleeveImage,
        PRINT: product.assets.printImage
    };
    const currentVariant = product.variants.find((v)=>v.size === selectedSize);
    const isSelectedSizeInStock = (currentVariant?.availableStock ?? 0) > 0;
    const isSelectedSizeLowStock = (currentVariant?.availableStock ?? 0) > 0 && (currentVariant?.availableStock ?? 0) <= (currentVariant?.threshold ?? 3);
    // Compute overall inventory status for the SSR sentinel
    const overallInventoryStatus = product.isSoldOut ? "SOLD_OUT" : product.variants.some((v)=>v.status === "LOW") ? "LOW" : "AVAILABLE";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "bexyee-product-experience",
        onPointerMove: handlePointerMove,
        style: {
            minHeight: "100vh",
            backgroundColor: "#F7F7F3",
            color: "#000000",
            fontFamily: "var(--font-space-mono), monospace",
            position: "relative",
            overflowX: "hidden"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "product-state",
                "data-purchase-mode": isPrebook ? "PREBOOK" : "BUY_NOW",
                "data-inventory-status": overallInventoryStatus,
                "data-price-paise": product.pricePaise,
                "data-is-live": isLive ? "true" : "false",
                "data-is-paused": isPaused ? "true" : "false",
                "data-product-slug": product.slug,
                style: {
                    display: "none"
                },
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$MovableBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MovableBackground"], {
                backgrounds: product.assets.backgrounds,
                backgroundType: product.assets.backgroundType,
                signal: signal
            }, void 0, false, {
                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$navigation$2f$GlobalHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlobalHeader"], {
                section: product.cityName ? product.cityName.slice(0, 3).toUpperCase() : product.collection ? product.collection.slice(0, 3).toUpperCase() : "STU",
                cartCountOverride: cartCount
            }, void 0, false, {
                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bexyee-product-stage-hero",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "product-hero-watermark",
                        "aria-hidden": "true",
                        children: product.cityName || product.collection || "BEXYEE"
                    }, void 0, false, {
                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "status",
                        "aria-live": "polite",
                        style: {
                            position: "fixed",
                            top: "76px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 100,
                            background: "#000000",
                            color: "#FFFFFF",
                            border: "1px solid #000000",
                            padding: "12px 24px",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)"
                        },
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                        lineNumber: 223,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "product-hero-composition",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hero-left-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-kicker-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "hero-eyebrow",
                                                children: [
                                                    "BEXYEE ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: "#E52B20"
                                                        },
                                                        children: "/"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                        lineNumber: 252,
                                                        columnNumber: 24
                                                    }, this),
                                                    " ",
                                                    product.cityName ? `${product.cityName} EDITION` : product.collection || "STUDIO CAPSULE"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 251,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "hero-drop-tag",
                                                children: isPaused ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        "PAUSED ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: "#E52B20"
                                                            },
                                                            children: "//"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                            lineNumber: 256,
                                                            columnNumber: 28
                                                        }, this),
                                                        " TEMPORARILY LOCKED"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 19
                                                }, this) : isPrebook ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        "PRE-BOOK ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: "#E52B20"
                                                            },
                                                            children: "//"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                            lineNumber: 258,
                                                            columnNumber: 30
                                                        }, this),
                                                        " LIMITED RUN"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                    lineNumber: 258,
                                                    columnNumber: 19
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        product.edition,
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: "#E52B20"
                                                            },
                                                            children: "//"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                            lineNumber: 260,
                                                            columnNumber: 39
                                                        }, this),
                                                        " LIMITED 100"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                    lineNumber: 260,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 254,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 250,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "hero-product-title",
                                        children: product.cityName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "title-city",
                                                    children: product.cityName
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                    lineNumber: 269,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "title-sub",
                                                    children: product.name.replace(new RegExp(product.cityName, "gi"), "").trim() || "HEAVYWEIGHT TEE"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                    lineNumber: 270,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 268,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "title-city",
                                            style: {
                                                letterSpacing: "-0.03em"
                                            },
                                            children: product.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 275,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 266,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "hero-editorial-line",
                                        children: product.description || "320 GSM Super Loopknit combed cotton engineered with structural boxy drape."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 279,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-view-selector-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "selector-label",
                                                children: "STUDIO VIEWS / 3D ANGLES:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 285,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "hero-view-pills",
                                                role: "group",
                                                "aria-label": "Product camera angles",
                                                children: VIEWS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>{
                                                            setView(item.id);
                                                            track("product_view_change", {
                                                                view: item.id
                                                            });
                                                        },
                                                        className: `view-pill ${view === item.id ? "active" : ""}`,
                                                        "aria-pressed": view === item.id,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "view-pill-thumb",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    src: viewPhotos[item.id] || viewPhotos.FRONT,
                                                                    alt: item.label,
                                                                    width: 28,
                                                                    height: 28,
                                                                    style: {
                                                                        objectFit: "contain"
                                                                    },
                                                                    unoptimized: true
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                    lineNumber: 299,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                lineNumber: 298,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: item.id
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                lineNumber: 308,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, item.id, true, {
                                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                        lineNumber: 288,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 286,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 284,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                lineNumber: 249,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hero-center-col",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hero-stage-container",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$HeroProduct3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HeroProduct3D"], {
                                            modelUrl: product.assets.modelUrl || "",
                                            view: view,
                                            signal: signal,
                                            viewPhotos: viewPhotos
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 318,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "product-stage-shadow",
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 324,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                    lineNumber: 317,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                lineNumber: 316,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hero-right-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-price-box",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "price-kicker",
                                                children: "PRICE // INCL. 12% GST & DISPATCH"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 332,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "price-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        className: "price-amount",
                                                        children: [
                                                            "₹",
                                                            (product.pricePaise / 100).toLocaleString("en-IN")
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 17
                                                    }, this),
                                                    product.compareAtPricePaise && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "price-compare",
                                                        children: [
                                                            "₹",
                                                            (product.compareAtPricePaise / 100).toLocaleString("en-IN")
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                        lineNumber: 338,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "price-edition-badge",
                                                        children: isPrebook ? "PRE-BOOK RUN" : "LIMITED DROP"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                        lineNumber: 342,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 333,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 331,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-size-box",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "size-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "size-title",
                                                        children: "SELECT SIZE (CHEST / LENGTH)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                        lineNumber: 351,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setIsSizeGuideOpen(true),
                                                        className: "size-guide-link",
                                                        children: "SIZE GUIDE (INCHES) ↗"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 350,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "size-pills-grid",
                                                role: "radiogroup",
                                                "aria-label": "Available garment sizes",
                                                children: [
                                                    "S",
                                                    "M",
                                                    "L",
                                                    "XL"
                                                ].map((s)=>{
                                                    const variant = product.variants.find((v)=>v.size === s);
                                                    const isAvailable = (variant?.availableStock ?? 0) > 0;
                                                    const isLow = isAvailable && (variant?.availableStock ?? 0) <= (variant?.threshold ?? 3);
                                                    const isSelected = selectedSize === s;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        role: "radio",
                                                        "aria-checked": isSelected,
                                                        disabled: !isAvailable,
                                                        onClick: ()=>setSelectedSize(s),
                                                        className: `size-pill ${isSelected ? "selected" : ""} ${!isAvailable ? "disabled" : ""}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "size-letter",
                                                                children: s
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                lineNumber: 378,
                                                                columnNumber: 23
                                                            }, this),
                                                            isLow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "size-low-pip",
                                                                children: "LOW"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                lineNumber: 379,
                                                                columnNumber: 33
                                                            }, this),
                                                            !isAvailable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "size-sold-label",
                                                                children: "SOLD"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                lineNumber: 380,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, s, true, {
                                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                        lineNumber: 369,
                                                        columnNumber: 21
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 361,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 349,
                                        columnNumber: 13
                                    }, this),
                                    isPaused ? /* PAUSED LAUNCH STATE: TEMPORARILY LOCKED */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-action-buttons single-btn",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            disabled: true,
                                            className: "hero-btn-buy disabled",
                                            style: {
                                                background: "#F3F4F6",
                                                color: "#6B7280",
                                                border: "1px solid #E5E7EB",
                                                cursor: "not-allowed"
                                            },
                                            children: "PRODUCT PAUSED"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 391,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 390,
                                        columnNumber: 15
                                    }, this) : isPrebook ? /* PRE-BOOK MODE: SHOW [ PRE-BOOK NOW ] | HIDE [ BUY NOW ] & [ ADD TO CART ] */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-action-cluster-prebook",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "hero-action-buttons single-btn",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>handleAddToCart(true),
                                                    disabled: isProcessing || !isSelectedSizeInStock,
                                                    className: "hero-btn-buy prebook-btn",
                                                    children: isProcessing ? "INITIALIZING..." : !isSelectedSizeInStock ? "SOLD OUT" : "PRE-BOOK NOW ↗"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                    lineNumber: 404,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 403,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "hero-prebook-notice",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "prebook-tag",
                                                        children: "PRE-BOOKING ACTIVE"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                        lineNumber: 419,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "prebook-desc",
                                                        children: [
                                                            "Allocated pre-order batch. Expected fulfillment:",
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: product.prebookConfig?.expectedFulfillmentDate || "OCTOBER 2026"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                lineNumber: 422,
                                                                columnNumber: 21
                                                            }, this),
                                                            ". Payment is secured upon order; dispatch tracking is issued upon quality clearance."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                        lineNumber: 420,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 418,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 402,
                                        columnNumber: 15
                                    }, this) : isBuyNow ? /* NORMAL BUY NOW MODE: SHOW [ BUY NOW ] + [ ADD TO CART ] | HIDE [ PRE-BOOK NOW ] */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-action-cluster-normal",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "hero-action-buttons",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>handleAddToCart(false),
                                                    disabled: isProcessing || !isSelectedSizeInStock,
                                                    className: "hero-btn-cart",
                                                    children: "ADD TO CART"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>handleAddToCart(true),
                                                    disabled: isProcessing || !isSelectedSizeInStock,
                                                    className: "hero-btn-buy",
                                                    children: isProcessing ? "INITIALIZING..." : !isSelectedSizeInStock ? "SOLD OUT" : "BUY NOW ↗"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                    lineNumber: 440,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 430,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 429,
                                        columnNumber: 15
                                    }, this) : /* UNAVAILABLE / SOLD OUT STATE */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-action-buttons single-btn",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            disabled: true,
                                            className: "hero-btn-buy disabled",
                                            children: "SOLD OUT"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 457,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 456,
                                        columnNumber: 15
                                    }, this),
                                    isSelectedSizeLowStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-stock-warning",
                                        children: isPrebook ? `● LOW ALLOCATION: Only ${currentVariant?.availableStock} pre-book unit${(currentVariant?.availableStock ?? 0) === 1 ? "" : "s"} remaining in size ${selectedSize}` : `● LOW STOCK: Only ${currentVariant?.availableStock} units remaining in size ${selectedSize}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 469,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                lineNumber: 329,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                        lineNumber: 247,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hero-bottom-bar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hero-inspiration-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inspiration-label",
                                        children: "INSPIRATION // NARRATIVE"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 481,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "inspiration-text",
                                        children: product.description || "Engineered from 320 GSM Super Loopknit combed cotton. Designed around the wet asphalt, neon reflections, and late-night geometry of MG Road after heavy monsoon showers."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 482,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                lineNumber: 480,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hero-meta-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "meta-coords",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "LOCATION:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 490,
                                                columnNumber: 15
                                            }, this),
                                            " 12.9716° N, 77.5946° E"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 489,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "meta-specs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "EDITION:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 493,
                                                columnNumber: 15
                                            }, this),
                                            " ",
                                            isPrebook ? "PRE-BOOKING ACTIVE" : product.edition
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 492,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                lineNumber: 488,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                        lineNumber: 479,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "product-specs-section",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "specs-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "specs-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "specs-eyebrow",
                                    children: "STRUCTURAL SPECIFICATIONS"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                    lineNumber: 503,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "specs-title",
                                    children: "Architectural Construction."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                    lineNumber: 504,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "specs-lead",
                                    children: "Every detail is engineered from scratch for high-tensile durability, thermal breathability, and non-distorting silhouette structure."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                    lineNumber: 505,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                            lineNumber: 502,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "specs-grid",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "spec-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "spec-num",
                                            children: "01 / TEXTILE"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 512,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "spec-name",
                                            children: "320 GSM Super Loopknit"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 513,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "spec-desc",
                                            children: "100% combed long-staple Indian cotton woven at ultra-high density for anti-shrink drape and humidity protection."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 514,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                    lineNumber: 511,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "spec-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "spec-num",
                                            children: "02 / SILHOUETTE"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 520,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "spec-name",
                                            children: "Sculpted Boxy Fit"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 521,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "spec-desc",
                                            children: "Drop-shoulder spatial geometry with reinforced collar ribbing that maintains structure wash after wash."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 522,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                    lineNumber: 519,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "spec-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "spec-num",
                                            children: "03 / PRINTING"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 528,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "spec-name",
                                            children: "Cured Plastisol Screenprint"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 529,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "spec-desc",
                                            children: "Multi-layer cured ink formulation resistant to cracking, peeling, and monsoon rain exposure."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 530,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                    lineNumber: 527,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "spec-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "spec-num",
                                            children: "04 / PACKAGING"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 536,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "spec-name",
                                            children: "100% Plastic-Free Dispatch"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 537,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "spec-desc",
                                            children: "Shipped in kraft water-repellent mailers with archival tissue and serialized authenticity certificate card."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 538,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                    lineNumber: 535,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                            lineNumber: 510,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "specs-table-box",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "specs-table-header",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "table-title",
                                            children: "Garment Measurement Matrix (Inches)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 547,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "table-note",
                                            children: "ALL MEASUREMENTS ARE TOLERATED TO ±0.5 INCHES"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                            lineNumber: 548,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                    lineNumber: 546,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        overflowX: "auto"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "specs-table",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "SIZE"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                            lineNumber: 555,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "CHEST (IN)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                            lineNumber: 556,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "LENGTH (IN)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                            lineNumber: 557,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "SHOULDER (IN)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                            lineNumber: 558,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "SLEEVE (IN)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                            lineNumber: 559,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "STATUS"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                            lineNumber: 560,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                    lineNumber: 554,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 553,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                children: [
                                                    "S",
                                                    "M",
                                                    "L",
                                                    "XL"
                                                ].map((s)=>{
                                                    const m = product.sizeChart?.measurements?.[s] ?? {
                                                        chest: 42,
                                                        length: 28.5,
                                                        shoulder: 20,
                                                        sleeve: 9
                                                    };
                                                    const variant = product.variants.find((v)=>v.size === s);
                                                    const isAvailable = (variant?.availableStock ?? 0) > 0 || isPrebook;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: selectedSize === s ? "active-size-row" : "",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "size-cell",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: s
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                    lineNumber: 577,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                lineNumber: 576,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: [
                                                                    m.chest,
                                                                    '"'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                lineNumber: 579,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: [
                                                                    m.length,
                                                                    '"'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                lineNumber: 580,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: [
                                                                    m.shoulder,
                                                                    '"'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                lineNumber: 581,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: [
                                                                    m.sleeve,
                                                                    '"'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                lineNumber: 582,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: isPrebook ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        color: "#000000",
                                                                        fontWeight: 700
                                                                    },
                                                                    children: "PRE-BOOK"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                    lineNumber: 585,
                                                                    columnNumber: 29
                                                                }, this) : isAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        color: "#16A34A",
                                                                        fontWeight: 700
                                                                    },
                                                                    children: "IN STOCK"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                    lineNumber: 587,
                                                                    columnNumber: 29
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        color: "#999999"
                                                                    },
                                                                    children: "SOLD OUT"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                    lineNumber: 589,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                                lineNumber: 583,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, s, true, {
                                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                        lineNumber: 575,
                                                        columnNumber: 23
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                                lineNumber: 563,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                        lineNumber: 552,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                                    lineNumber: 551,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                            lineNumber: 545,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                    lineNumber: 501,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                lineNumber: 500,
                columnNumber: 7
            }, this),
            isSizeGuideOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$commerce$2f$SizeGuideModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SizeGuideModal"], {
                sizeChart: product.sizeChart || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sizing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_APPAREL_SIZE_CHART"],
                isOpen: isSizeGuideOpen,
                onClose: ()=>setIsSizeGuideOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                lineNumber: 604,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$navigation$2f$StorefrontFooter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StorefrontFooter"], {}, void 0, false, {
                fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
                lineNumber: 612,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/experience/ProductPageRenderer.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, this);
}
_s(ProductPageRenderer, "TV6izW0jGLjCeynR1XeSz+Q4MgU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ProductPageRenderer;
var _c;
__turbopack_context__.k.register(_c, "ProductPageRenderer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/hero/HeroProduct3D.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeroProduct3D",
    ()=>HeroProduct3D
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$156d8d12$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-156d8d12.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Gltf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Gltf.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$adaptive$2d$network$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/adaptive-network.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const viewAngles = {
    FRONT: 0,
    BACK: Math.PI,
    "LEFT SLEEVE": Math.PI / 2,
    "RIGHT SLEEVE": -Math.PI / 2,
    PRINT: -0.55
};
function ProductModel({ url, view, signal, onLoaded }) {
    _s();
    const { scene } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Gltf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGLTF"])(url);
    const group = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const target = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(viewAngles[view] ?? 0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductModel.useEffect": ()=>{
            onLoaded();
        }
    }["ProductModel.useEffect"], [
        onLoaded
    ]);
    // Set initial angle immediately to avoid pop
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductModel.useEffect": ()=>{
            if (group.current) {
                const desired = viewAngles[view] ?? 0;
                const current = group.current.rotation.y;
                target.current = current + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].euclideanModulo(desired - current + Math.PI, Math.PI * 2) - Math.PI;
            }
        }
    }["ProductModel.useEffect"], [
        view
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$156d8d12$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "ProductModel.useFrame": (_, delta)=>{
            if (!group.current) return;
            group.current.rotation.y = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(group.current.rotation.y, target.current, 4.2, delta);
            group.current.rotation.x = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(group.current.rotation.x, (signal.y - 50) * 0.0015, 3, delta);
            group.current.rotation.z = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(group.current.rotation.z, (signal.x - 50) * -0.0015, 3, delta);
        }
    }["ProductModel.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
        object: scene,
        ref: group,
        scale: 2.35,
        position: [
            0,
            -1.55,
            0
        ]
    }, void 0, false, {
        fileName: "[project]/src/components/hero/HeroProduct3D.tsx",
        lineNumber: 52,
        columnNumber: 10
    }, this);
}
_s(ProductModel, "Ihjo+RStf7ttZ1WfNESql/BWiH8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Gltf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGLTF"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$156d8d12$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c = ProductModel;
function HeroProduct3D({ modelUrl, view, signal, viewPhotos }) {
    _s1();
    const [is3DReady, setIs3DReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [shouldLoad3D, setShouldLoad3D] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [is3DFailed, setIs3DFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [adaptive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "HeroProduct3D.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$adaptive$2d$network$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAdaptiveMode"])()
    }["HeroProduct3D.useState"]);
    // 1. Adaptive Preloader:
    // Step 1: Active view renders immediately (0ms, 100% bandwidth dedicated to active photo for fastest LCP).
    // Step 2: On fast network only, remaining view photos are preloaded during post-render idle.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroProduct3D.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") === "undefined" || !adaptive.isPrefetchAllowed) return;
            const otherPhotos = Object.entries(viewPhotos).filter({
                "HeroProduct3D.useEffect.otherPhotos": ([key])=>key !== view
            }["HeroProduct3D.useEffect.otherPhotos"]).map({
                "HeroProduct3D.useEffect.otherPhotos": ([, url])=>url
            }["HeroProduct3D.useEffect.otherPhotos"]).filter(Boolean);
            const runPreload = {
                "HeroProduct3D.useEffect.runPreload": ()=>{
                    otherPhotos.forEach({
                        "HeroProduct3D.useEffect.runPreload": (url)=>{
                            const img = new Image();
                            img.src = url;
                        }
                    }["HeroProduct3D.useEffect.runPreload"]);
                }
            }["HeroProduct3D.useEffect.runPreload"];
            if ("requestIdleCallback" in window) {
                const handle = window.requestIdleCallback(runPreload, {
                    timeout: 1200
                });
                return ({
                    "HeroProduct3D.useEffect": ()=>{
                        window.cancelIdleCallback?.(handle);
                    }
                })["HeroProduct3D.useEffect"];
            } else {
                const timer = setTimeout(runPreload, 150);
                return ({
                    "HeroProduct3D.useEffect": ()=>clearTimeout(timer)
                })["HeroProduct3D.useEffect"];
            }
        }
    }["HeroProduct3D.useEffect"], [
        view,
        viewPhotos,
        adaptive.isPrefetchAllowed
    ]);
    // 2. Adaptive Deferred background 3D initialization
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroProduct3D.useEffect": ()=>{
            if (!adaptive.is3DAllowed || !modelUrl) {
                return;
            }
            // Defer 3D until after first paint + user reaction window
            const timer = setTimeout({
                "HeroProduct3D.useEffect.timer": ()=>{
                    setShouldLoad3D(true);
                }
            }["HeroProduct3D.useEffect.timer"], 450);
            return ({
                "HeroProduct3D.useEffect": ()=>clearTimeout(timer)
            })["HeroProduct3D.useEffect"];
        }
    }["HeroProduct3D.useEffect"], [
        modelUrl,
        adaptive.is3DAllowed
    ]);
    const activePhoto = viewPhotos[view] || viewPhotos.FRONT || "/assets/products/bengaluru-tee-front.svg";
    const dpr = adaptive.isHighDprAllowed ? [
        1,
        1.75
    ] : [
        1,
        1.25
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "product-stage",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "product-photo-layer",
                style: {
                    opacity: is3DReady && !is3DFailed ? 0 : 1,
                    pointerEvents: is3DReady && !is3DFailed ? "none" : "auto",
                    transition: adaptive.isHeavyAnimationAllowed ? "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                    transform: adaptive.isHeavyAnimationAllowed ? `translate3d(${(signal.x - 50) * 0.05}px, ${(signal.y - 50) * 0.05}px, 0)` : undefined
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: activePhoto,
                    alt: `BEXYEE Product view - ${view}`,
                    className: "product-hero-image",
                    loading: "eager",
                    decoding: "async"
                }, view, false, {
                    fileName: "[project]/src/components/hero/HeroProduct3D.tsx",
                    lineNumber: 132,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/hero/HeroProduct3D.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            shouldLoad3D && modelUrl && adaptive.is3DAllowed && !is3DFailed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "product-canvas-layer",
                style: {
                    opacity: is3DReady ? 1 : 0,
                    transition: adaptive.isHeavyAnimationAllowed ? "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
                    camera: {
                        position: [
                            0,
                            0,
                            6
                        ],
                        fov: 34
                    },
                    dpr: dpr,
                    shadows: adaptive.deviceTier === "HIGH",
                    frameloop: "always",
                    onError: ()=>{
                        setIs3DFailed(true);
                        setIs3DReady(false);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                            intensity: adaptive.deviceTier === "LOW" ? 1.2 : 0.85
                        }, void 0, false, {
                            fileName: "[project]/src/components/hero/HeroProduct3D.tsx",
                            lineNumber: 161,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                            position: [
                                3,
                                5,
                                4
                            ],
                            intensity: 3.2,
                            castShadow: adaptive.deviceTier === "HIGH"
                        }, void 0, false, {
                            fileName: "[project]/src/components/hero/HeroProduct3D.tsx",
                            lineNumber: 162,
                            columnNumber: 13
                        }, this),
                        adaptive.deviceTier !== "LOW" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                            position: [
                                -4,
                                2,
                                -2
                            ],
                            intensity: 0.65,
                            color: "#e52b20"
                        }, void 0, false, {
                            fileName: "[project]/src/components/hero/HeroProduct3D.tsx",
                            lineNumber: 168,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                            fallback: null,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductModel, {
                                url: modelUrl,
                                view: view,
                                signal: signal,
                                onLoaded: ()=>setIs3DReady(true)
                            }, void 0, false, {
                                fileName: "[project]/src/components/hero/HeroProduct3D.tsx",
                                lineNumber: 171,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/hero/HeroProduct3D.tsx",
                            lineNumber: 170,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/hero/HeroProduct3D.tsx",
                    lineNumber: 151,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/hero/HeroProduct3D.tsx",
                lineNumber: 144,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "model-label",
                children: is3DReady && !is3DFailed ? `BEXYEE / 3D OBJECT (${view})` : `BEXYEE / STUDIO PHOTO (${view})`
            }, void 0, false, {
                fileName: "[project]/src/components/hero/HeroProduct3D.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/hero/HeroProduct3D.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_s1(HeroProduct3D, "kVz/IIiakA9I+Vpy8wOhyRhLGRc=");
_c1 = HeroProduct3D;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProductModel");
__turbopack_context__.k.register(_c1, "HeroProduct3D");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/hero/MovableBackground.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MovableBackground",
    ()=>MovableBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$adaptive$2d$network$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/adaptive-network.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function MovableBackground({ backgrounds, backgroundType = "DEFAULT_STUDIO", signal }) {
    _s();
    const [adaptive, setAdaptive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "MovableBackground.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$adaptive$2d$network$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAdaptiveMode"])()
    }["MovableBackground.useState"]);
    const [deviceType, setDeviceType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("desktop");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MovableBackground.useEffect": ()=>{
            setAdaptive((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$adaptive$2d$network$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAdaptiveMode"])());
            const updateDevice = {
                "MovableBackground.useEffect.updateDevice": ()=>{
                    const w = window.innerWidth;
                    if (w <= 640) {
                        setDeviceType("mobile");
                    } else if (w <= 1024) {
                        setDeviceType("tablet");
                    } else {
                        setDeviceType("desktop");
                    }
                }
            }["MovableBackground.useEffect.updateDevice"];
            updateDevice();
            window.addEventListener("resize", updateDevice);
            return ({
                "MovableBackground.useEffect": ()=>window.removeEventListener("resize", updateDevice)
            })["MovableBackground.useEffect"];
        }
    }["MovableBackground.useEffect"], []);
    // Determine active background image based on viewport and mode
    const isNone = backgroundType === "NONE" || !backgrounds?.desktop && !backgrounds?.tablet && !backgrounds?.mobile && backgroundType !== "DEFAULT_STUDIO";
    const neutralStudioFallback = "/assets/environments/bexyee-studio-neutral.svg";
    let activeBg = "";
    if (!isNone && backgroundType !== "NONE") {
        activeBg = backgrounds?.desktop || (backgroundType === "DEFAULT_STUDIO" ? neutralStudioFallback : "");
        if (deviceType === "mobile" && backgrounds?.mobile) {
            activeBg = backgrounds.mobile;
        } else if (deviceType === "tablet" && backgrounds?.tablet) {
            activeBg = backgrounds.tablet;
        }
    }
    // Parallax translation (subtle ambient depth, restrained motion)
    const isAnimated = adaptive.isHeavyAnimationAllowed;
    const offsetX = isAnimated ? (signal.x - 50) * 0.14 : 0;
    const offsetY = isAnimated ? (signal.y - 50) * 0.14 : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bexyee-movable-background-container",
        "aria-hidden": "true",
        style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 0,
            background: "#080807"
        },
        children: [
            activeBg ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bexyee-movable-background",
                style: {
                    position: "absolute",
                    top: "-6%",
                    left: "-6%",
                    width: "112%",
                    height: "112%",
                    backgroundImage: `url(${activeBg})`,
                    backgroundPosition: "center center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    opacity: 0.35,
                    filter: "contrast(115%) brightness(85%)",
                    transform: isAnimated ? `translate3d(${offsetX}px, ${offsetY}px, 0) scale(1.03)` : "none",
                    transition: isAnimated ? "transform 0.4s cubic-bezier(0.2, 0.8, 0.4, 1)" : "none",
                    willChange: "transform"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/hero/MovableBackground.tsx",
                lineNumber: 75,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 1440 900",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                style: {
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0.4,
                    transform: isAnimated ? `translate3d(${offsetX * 0.5}px, ${offsetY * 0.5}px, 0)` : "none",
                    transition: isAnimated ? "transform 0.5s ease-out" : "none"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M-100 250 C 350 120, 700 480, 1100 180 S 1600 350, 1700 220",
                        stroke: "#E52B20",
                        strokeWidth: "1.2",
                        strokeOpacity: "0.45",
                        fill: "none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/MovableBackground.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M-50 650 C 400 450, 750 780, 1200 520 S 1650 700, 1800 600",
                        stroke: "#E52B20",
                        strokeWidth: "0.8",
                        strokeOpacity: "0.3",
                        fill: "none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/MovableBackground.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M100 -50 C 450 300, 300 650, 950 850 S 1400 600, 1550 950",
                        stroke: "#FFFFFF",
                        strokeWidth: "0.6",
                        strokeOpacity: "0.15",
                        strokeDasharray: "4 8",
                        fill: "none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/MovableBackground.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/hero/MovableBackground.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at 65% 45%, rgba(229, 43, 32, 0.12) 0%, rgba(10, 10, 9, 0.6) 50%, #080807 88%)"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/hero/MovableBackground.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/hero/MovableBackground.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(MovableBackground, "arlnZN8c4JcYSXvOb1qHI+ha++g=");
_c = MovableBackground;
var _c;
__turbopack_context__.k.register(_c, "MovableBackground");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/navigation/GlobalHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DRAWER_NAV_ITEMS",
    ()=>DRAWER_NAV_ITEMS,
    "GlobalHeader",
    ()=>GlobalHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const CENTER_NAV_LINKS = [
    {
        label: "SHOP",
        href: "/products"
    },
    {
        label: "NEW",
        href: "/product/bengaluru-tee"
    },
    {
        label: "COLLECTIONS",
        href: "/collections"
    },
    {
        label: "ABOUT",
        href: "/about"
    }
];
const DRAWER_NAV_ITEMS = [
    {
        label: "HOME",
        href: "/"
    },
    {
        label: "CATALOG",
        href: "/products"
    },
    {
        label: "CITIES",
        href: "/cities"
    },
    {
        label: "JOURNAL",
        href: "/blog"
    },
    {
        label: "LOOKBOOK",
        href: "/lookbook"
    },
    {
        label: "ABOUT",
        href: "/about"
    },
    {
        label: "PRODUCTS",
        href: "/products"
    },
    {
        label: "COLLECTIONS",
        href: "/collections"
    },
    {
        label: "STORIES",
        href: "/stories"
    },
    {
        label: "ACHIEVEMENTS",
        href: "/achievements"
    },
    {
        label: "CONTACT",
        href: "/contact"
    },
    {
        label: "ACCOUNT",
        href: "/account"
    },
    {
        label: "SEARCH",
        href: "/search"
    },
    {
        label: "CART",
        href: "/cart"
    }
];
function GlobalHeader({ section, cartCountOverride }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])() || "/";
    const [localCartCount, setLocalCartCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "GlobalHeader.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                const stored = JSON.parse(window.localStorage.getItem("bexyee_cart") ?? "[]");
                return stored.reduce({
                    "GlobalHeader.useState": (sum, item)=>sum + (item.quantity || 1)
                }["GlobalHeader.useState"], 0);
            } catch  {
                return 0;
            }
        }
    }["GlobalHeader.useState"]);
    const [isMenuOpen, setIsMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isScrolled, setIsScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const triggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const drawerPanelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scrollYRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const cartCount = typeof cartCountOverride === "number" ? cartCountOverride : localCartCount;
    // Track window scroll for subtle glass/border transition
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalHeader.useEffect": ()=>{
            function handleScroll() {
                setIsScrolled(window.scrollY > 20);
            }
            handleScroll();
            window.addEventListener("scroll", handleScroll, {
                passive: true
            });
            return ({
                "GlobalHeader.useEffect": ()=>window.removeEventListener("scroll", handleScroll)
            })["GlobalHeader.useEffect"];
        }
    }["GlobalHeader.useEffect"], []);
    // Sync cart count from storage events
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalHeader.useEffect": ()=>{
            function handleStorageSync() {
                try {
                    const stored = JSON.parse(window.localStorage.getItem("bexyee_cart") ?? "[]");
                    setLocalCartCount(stored.reduce({
                        "GlobalHeader.useEffect.handleStorageSync": (sum, item)=>sum + (item.quantity || 1)
                    }["GlobalHeader.useEffect.handleStorageSync"], 0));
                } catch  {
                    setLocalCartCount(0);
                }
            }
            window.addEventListener("storage", handleStorageSync);
            window.addEventListener("bexyee_cart_updated", handleStorageSync);
            return ({
                "GlobalHeader.useEffect": ()=>{
                    window.removeEventListener("storage", handleStorageSync);
                    window.removeEventListener("bexyee_cart_updated", handleStorageSync);
                }
            })["GlobalHeader.useEffect"];
        }
    }["GlobalHeader.useEffect"], []);
    // Handle Scroll Lock, Scroll Restoration, Focus Trap, and Escape Key
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalHeader.useEffect": ()=>{
            if (isMenuOpen) {
                // 1. Lock background scrolling while preserving exact scroll offset
                scrollYRef.current = window.scrollY;
                document.body.style.position = "fixed";
                document.body.style.top = `-${scrollYRef.current}px`;
                document.body.style.width = "100%";
                document.body.style.overflowY = "scroll"; // avoid layout jump
                // 2. Focus first interactive element in drawer
                const timer = setTimeout({
                    "GlobalHeader.useEffect.timer": ()=>{
                        if (drawerPanelRef.current) {
                            const focusable = drawerPanelRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                            if (focusable.length > 0) {
                                focusable[0].focus();
                            }
                        }
                    }
                }["GlobalHeader.useEffect.timer"], 50);
                // 3. Escape key & Focus Trap handler
                function handleKeyDown(e) {
                    if (e.key === "Escape") {
                        setIsMenuOpen(false);
                        return;
                    }
                    if (e.key === "Tab" && drawerPanelRef.current) {
                        const focusable = Array.from(drawerPanelRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
                        if (focusable.length === 0) return;
                        const firstElement = focusable[0];
                        const lastElement = focusable[focusable.length - 1];
                        if (e.shiftKey) {
                            if (document.activeElement === firstElement) {
                                e.preventDefault();
                                lastElement.focus();
                            }
                        } else {
                            if (document.activeElement === lastElement) {
                                e.preventDefault();
                                firstElement.focus();
                            }
                        }
                    }
                }
                window.addEventListener("keydown", handleKeyDown);
                return ({
                    "GlobalHeader.useEffect": ()=>{
                        clearTimeout(timer);
                        window.removeEventListener("keydown", handleKeyDown);
                        // Restore background scroll position
                        document.body.style.position = "";
                        document.body.style.top = "";
                        document.body.style.width = "";
                        document.body.style.overflowY = "";
                        window.scrollTo(0, scrollYRef.current);
                    }
                })["GlobalHeader.useEffect"];
            } else {
                // When closed, restore focus to trigger button if previously opened
                if (triggerRef.current) {
                    triggerRef.current.focus();
                }
            }
        }
    }["GlobalHeader.useEffect"], [
        isMenuOpen
    ]);
    // Determine section label automatically if not explicitly provided
    let displaySection = section;
    if (!displaySection) {
        if (pathname === "/") displaySection = "HOME";
        else if (pathname.startsWith("/bengaluru")) displaySection = "BEN";
        else if (pathname.startsWith("/products")) displaySection = "CATALOG";
        else if (pathname.startsWith("/cities")) displaySection = "CITIES";
        else if (pathname.startsWith("/blog")) displaySection = "JOURNAL";
        else if (pathname.startsWith("/lookbook")) displaySection = "LOOKBOOK";
        else if (pathname.startsWith("/about")) displaySection = "ABOUT";
        else if (pathname.startsWith("/stories")) displaySection = "STORIES";
        else if (pathname.startsWith("/collections")) displaySection = "COLLECTIONS";
        else if (pathname.startsWith("/search")) displaySection = "SEARCH";
        else if (pathname.startsWith("/faq")) displaySection = "FAQ";
        else if (pathname.startsWith("/size-guide")) displaySection = "SIZING";
        else if (pathname.startsWith("/achievements")) displaySection = "STANDARDS";
        else if (pathname.startsWith("/contact")) displaySection = "CONTACT";
        else if (pathname.startsWith("/account")) displaySection = "ACCOUNT";
        else if (pathname.startsWith("/cart")) displaySection = "CART";
        else if (pathname.startsWith("/checkout")) displaySection = "CHECKOUT";
        else if (pathname.startsWith("/track")) displaySection = "TRACK";
        else displaySection = "STORE";
    }
    function isActive(href) {
        if (href === "/" && pathname === "/") return true;
        if (href === "/products" && pathname.startsWith("/products")) return true;
        if (href === "/cities" && pathname.startsWith("/cities")) return true;
        if (href === "/blog" && pathname.startsWith("/blog")) return true;
        if (href === "/lookbook" && pathname.startsWith("/lookbook")) return true;
        if (href === "/about" && pathname === "/about") return true;
        if (href === "/collections" && pathname.startsWith("/collections")) return true;
        if (href === "/stories" && pathname.startsWith("/stories")) return true;
        if (href === "/achievements" && pathname === "/achievements") return true;
        if (href === "/contact" && pathname === "/contact") return true;
        if (href === "/account" && pathname.startsWith("/account")) return true;
        if (href === "/search" && pathname === "/search") return true;
        if (href === "/cart" && pathname === "/cart") return true;
        return pathname === href;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: `global-header ${isScrolled ? "scrolled" : ""}`,
        role: "banner",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "global-nav",
                "aria-label": "Main Navigation",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "global-nav-left",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "global-wordmark",
                            "aria-label": "BEXYEE Homepage",
                            children: [
                                "BEXYEE",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "brand-slash",
                                    children: "/"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                    lineNumber: 209,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "brand-section",
                                    children: displaySection
                                }, void 0, false, {
                                    fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                            lineNumber: 208,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                        lineNumber: 207,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "global-nav-center",
                        role: "list",
                        children: CENTER_NAV_LINKS.map((link)=>{
                            const active = isActive(link.href);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                role: "listitem",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: link.href,
                                    className: `global-nav-link ${active ? "active" : ""}`,
                                    "aria-current": active ? "page" : undefined,
                                    children: [
                                        link.label,
                                        active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "active-dot",
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                            lineNumber: 226,
                                            columnNumber: 30
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                    lineNumber: 220,
                                    columnNumber: 17
                                }, this)
                            }, link.href, false, {
                                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                lineNumber: 219,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                        lineNumber: 215,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "global-nav-right",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/search",
                                className: `global-util-link ${pathname === "/search" ? "active" : ""}`,
                                "aria-label": "Search archive",
                                children: "SEARCH"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/account",
                                className: `global-util-link ${pathname.startsWith("/account") ? "active" : ""}`,
                                "aria-label": "Collector account",
                                children: "ACCOUNT"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                lineNumber: 243,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/cart",
                                className: `global-util-link global-cart-link ${pathname === "/cart" ? "active" : ""}`,
                                "aria-label": `Shopping cart containing ${cartCount} items`,
                                children: [
                                    "CART ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "cart-badge",
                                        children: [
                                            "(",
                                            cartCount,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                        lineNumber: 256,
                                        columnNumber: 18
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                ref: triggerRef,
                                type: "button",
                                className: "global-menu-btn",
                                onClick: ()=>setIsMenuOpen(true),
                                "aria-label": "Open menu",
                                "aria-expanded": isMenuOpen,
                                "aria-controls": "global-nav-drawer",
                                children: [
                                    "MENU ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "menu-plus",
                                        children: "+"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                        lineNumber: 269,
                                        columnNumber: 18
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                lineNumber: 260,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this),
            isMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "global-nav-drawer",
                className: "global-mobile-drawer drawer-open",
                role: "dialog",
                "aria-modal": "true",
                "aria-label": "Global Navigation Menu",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "drawer-backdrop",
                        onClick: ()=>setIsMenuOpen(false),
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                        lineNumber: 284,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "drawer-panel",
                        ref: drawerPanelRef,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "drawer-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "global-wordmark",
                                        children: [
                                            "BEXYEE",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "brand-slash",
                                                children: "/"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                                lineNumber: 294,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "brand-section",
                                                children: displaySection
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                                lineNumber: 295,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                        lineNumber: 293,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "drawer-close-btn",
                                        onClick: ()=>setIsMenuOpen(false),
                                        "aria-label": "Close menu",
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                        lineNumber: 297,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                lineNumber: 292,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "drawer-nav",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "drawer-links",
                                    role: "list",
                                    children: DRAWER_NAV_ITEMS.map((item, index)=>{
                                        const active = isActive(item.href);
                                        const isCartItem = item.label === "CART";
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            role: "listitem",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                className: `drawer-link ${active ? "active" : ""}`,
                                                "aria-current": active ? "page" : undefined,
                                                onClick: ()=>setIsMenuOpen(false),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            item.label,
                                                            isCartItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "drawer-cart-count",
                                                                children: [
                                                                    " (",
                                                                    cartCount,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                                                lineNumber: 322,
                                                                columnNumber: 42
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                                        lineNumber: 320,
                                                        columnNumber: 25
                                                    }, this),
                                                    active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "drawer-active-indicator",
                                                        "aria-hidden": "true",
                                                        children: "●"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                                        lineNumber: 324,
                                                        columnNumber: 36
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                                lineNumber: 314,
                                                columnNumber: 23
                                            }, this)
                                        }, `${item.label}-${item.href}-${index}`, false, {
                                            fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                            lineNumber: 313,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                    lineNumber: 308,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                lineNumber: 307,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "drawer-footer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "© 2026 BEXYEE STUDIO"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                        lineNumber: 333,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "12.9716° N, 77.5946° E"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                        lineNumber: 334,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                                lineNumber: 332,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                        lineNumber: 291,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
                lineNumber: 276,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/navigation/GlobalHeader.tsx",
        lineNumber: 204,
        columnNumber: 5
    }, this);
}
_s(GlobalHeader, "MIKj4wbrTJYIAp5VnxN6ULDtMCM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = GlobalHeader;
var _c;
__turbopack_context__.k.register(_c, "GlobalHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/navigation/StorefrontFooter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StorefrontFooter",
    ()=>StorefrontFooter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
"use client";
;
;
function StorefrontFooter() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "bexyee-storefront-footer",
        role: "contentinfo",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "footer-top-grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "footer-brand-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "footer-brand-logo",
                                children: [
                                    "BEXYEE",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "brand-slash",
                                        children: "/"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 12,
                                        columnNumber: 19
                                    }, this),
                                    "STUDIO"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 11,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "footer-brand-tagline",
                                children: "Limited-edition architectural streetwear engineered for the metropolis. Handcrafted in India."
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 14,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "footer-geo-tag",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "COORDINATES:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 18,
                                        columnNumber: 13
                                    }, this),
                                    " 12.9716° N, 77.5946° E"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 17,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                        lineNumber: 10,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "footer-links-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "footer-col-header",
                                children: "CATALOG"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 24,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "footer-col-list",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/products",
                                            children: "Shop All Releases"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 26,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 26,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/product/bengaluru-tee",
                                            children: "New: Bengaluru Drop"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 27,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 27,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/collections",
                                            children: "Capsules"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 28,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 28,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/cities",
                                            children: "Metropolis Network"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 29,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 29,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/lookbook",
                                            children: "Lookbook"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 30,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 30,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 25,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "footer-links-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "footer-col-header",
                                children: "SUPPORT"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "footer-col-list",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/account/orders",
                                            children: "Orders"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 37,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 37,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/track",
                                            children: "Track Order"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 38,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 38,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/legal/refunds",
                                            children: "Returns & Exchanges"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 39,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 39,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/size-guide",
                                            children: "Size Guide"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 40,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 40,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/contact",
                                            children: "Contact & Concierge"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 41,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 41,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "footer-links-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "footer-col-header",
                                children: "CONNECT & ABOUT"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "footer-col-list",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/about",
                                            children: "Design Philosophy"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 48,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 48,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/blog",
                                            children: "320 GSM Loopknit Journal"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 49,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 49,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://instagram.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            children: "Instagram ↗"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 50,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 50,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://youtube.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            children: "YouTube ↗"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 51,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 51,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/stories",
                                            children: "City Stories"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                            lineNumber: 52,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 52,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "footer-newsletter-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "footer-col-header",
                                children: "ARCHIVE DISPATCH"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "footer-newsletter-copy",
                                children: "Receive private access signals 15 minutes before public drop windows."
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                className: "footer-newsletter-form",
                                onSubmit: (e)=>e.preventDefault(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "email",
                                        placeholder: "ENTER EMAIL",
                                        "aria-label": "Email address for drop notifications",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 63,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        "aria-label": "Subscribe to signals",
                                        children: "JOIN ↗"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                        lineNumber: 69,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "footer-bottom-bar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "footer-bottom-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "© 2026 BEXYEE STUDIO. ALL RIGHTS RESERVED."
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 78,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "bullet-sep",
                                children: "•"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "320 GSM COMBED COTTON // BENGALURU, INDIA"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "footer-bottom-links",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/legal/privacy",
                                children: "Privacy Policy"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/legal/terms",
                                children: "Terms of Service"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/legal/shipping",
                                children: "Shipping Policy"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/legal/refunds",
                                children: "Refund Policy"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/admin/login",
                                className: "footer-admin-link",
                                children: "Ops ↗"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/navigation/StorefrontFooter.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = StorefrontFooter;
var _c;
__turbopack_context__.k.register(_c, "StorefrontFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/adaptive-network.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "detectWebGLSupport",
    ()=>detectWebGLSupport,
    "getAdaptiveMode",
    ()=>getAdaptiveMode
]);
function detectWebGLSupport() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        return Boolean(gl);
    } catch  {
        return false;
    }
}
function getAdaptiveMode() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const hasWebGL = detectWebGLSupport();
    // 1. Check Offline State
    if (typeof navigator !== "undefined" && !navigator.onLine) {
        return {
            isFastNetwork: false,
            is3DAllowed: false,
            isHighDprAllowed: false,
            isPrefetchAllowed: false,
            isHeavyAnimationAllowed: false,
            hasWebGL,
            networkProfile: "OFFLINE",
            deviceTier: "CONSTRAINED"
        };
    }
    // 2. User & Hardware Constraints
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const nav = navigator;
    const isSaveData = nav.connection?.saveData === true;
    const effectiveType = nav.connection?.effectiveType ?? "4g";
    const rtt = nav.connection?.rtt ?? 50;
    const cores = nav.hardwareConcurrency || 4;
    const memory = nav.deviceMemory || 4;
    const isSlowNetwork = isSaveData || effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g" || rtt > 300;
    let deviceTier = "MEDIUM";
    if (cores >= 8 && memory >= 6) {
        deviceTier = "HIGH";
    } else if (cores < 4 || memory < 3) {
        deviceTier = "LOW";
    }
    if (isSaveData) {
        return {
            isFastNetwork: false,
            is3DAllowed: false,
            isHighDprAllowed: false,
            isPrefetchAllowed: false,
            isHeavyAnimationAllowed: false,
            hasWebGL,
            networkProfile: "SAVE_DATA",
            deviceTier: "CONSTRAINED"
        };
    }
    if (isSlowNetwork) {
        return {
            isFastNetwork: false,
            is3DAllowed: false,
            isHighDprAllowed: false,
            isPrefetchAllowed: false,
            isHeavyAnimationAllowed: !prefersReducedMotion,
            hasWebGL,
            networkProfile: "SLOW",
            deviceTier: deviceTier === "HIGH" ? "MEDIUM" : "LOW"
        };
    }
    // Fast network + capable device + WebGL supported
    const is3DAllowed = hasWebGL && deviceTier !== "LOW" && !prefersReducedMotion;
    return {
        isFastNetwork: true,
        is3DAllowed,
        isHighDprAllowed: deviceTier === "HIGH",
        isPrefetchAllowed: true,
        isHeavyAnimationAllowed: !prefersReducedMotion,
        hasWebGL,
        networkProfile: "FAST",
        deviceTier
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/sizing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_APPAREL_SIZE_CHART",
    ()=>DEFAULT_APPAREL_SIZE_CHART,
    "inchesToCm",
    ()=>inchesToCm,
    "resolveSizeChart",
    ()=>resolveSizeChart
]);
const DEFAULT_APPAREL_SIZE_CHART = {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Standard Apparel Tops (S/M/L/XL)",
    category: "APPAREL_TOPS",
    unit: "INCHES",
    measurements: {
        S: {
            length: 28.5,
            chest: 42.0,
            shoulder: 20.5,
            sleeve: 8.5
        },
        M: {
            length: 29.5,
            chest: 44.0,
            shoulder: 21.5,
            sleeve: 9.0
        },
        L: {
            length: 30.5,
            chest: 46.0,
            shoulder: 22.5,
            sleeve: 9.5
        },
        XL: {
            length: 31.5,
            chest: 48.0,
            shoulder: 23.5,
            sleeve: 10.0
        }
    },
    isDefault: true
};
function resolveSizeChart(customChart) {
    if (!customChart || !customChart.measurements) {
        return DEFAULT_APPAREL_SIZE_CHART;
    }
    return {
        id: customChart.id || DEFAULT_APPAREL_SIZE_CHART.id,
        name: customChart.name || DEFAULT_APPAREL_SIZE_CHART.name,
        category: customChart.category || DEFAULT_APPAREL_SIZE_CHART.category,
        unit: customChart.unit || DEFAULT_APPAREL_SIZE_CHART.unit,
        measurements: {
            ...DEFAULT_APPAREL_SIZE_CHART.measurements,
            ...customChart.measurements
        },
        isDefault: customChart.isDefault ?? false
    };
}
function inchesToCm(inches) {
    return Math.round(inches * 2.54 * 10) / 10;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1h_1pr9._.js.map