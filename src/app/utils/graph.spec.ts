import { orderGraphNodes } from "./graph";

fdescribe('Graph Utils', () => {

    it('should return the correct result #1', () => {
        //        a
        //      /   \
        //      b    c 
        //      |    |
        //      d    e

        const nodes = [
            { id: 1, name: "b", },
            { id: 2, name: "c", },
            { id: 0, name: "a", },
            { id: 3, name: "d", },
            { id: 4, name: "e", },
        ];
        const links = [
            { sourceId: 0, targetId: 2 },
            { sourceId: 0, targetId: 1 },
            { sourceId: 1, targetId: 3 },
            { sourceId: 2, targetId: 4 },
        ];

        const graph = { nodes, links };

        const res = orderGraphNodes(graph as any).map((n: any) => n.name);
        expect(res).toEqual(["a", "b", "d", "c", "e"]);
    });

    it('should return the correct array from V shaped graph #2', () => {
        //      a  b
        //      |  |
        //      c  d
        //       \ /
        //        e

        const nodes = [
            { id: 1, name: "b", },
            { id: 2, name: "c", },
            { id: 0, name: "a", },
            { id: 3, name: "d", },
            { id: 4, name: "e", },
        ];
        const links = [
            { sourceId: 0, targetId: 2 },
            { sourceId: 1, targetId: 3 },
            { sourceId: 2, targetId: 4 },
            { sourceId: 3, targetId: 4 },
        ];

        const graph = { nodes, links };

        const res = orderGraphNodes(graph as any).map((n: any) => n.name);
        expect(res).toEqual(["a", "c", "b", "d", "e"]);
    });

    it('should return the correct result from X shaped graph  #3', () => {
        //      a  b
        //      \ /
        //       c
        //      / \
        //      d  e

        const nodes = [
            { id: 4, name: "e", },
            { id: 1, name: "b", },
            { id: 2, name: "c", },
            { id: 0, name: "a", },
            { id: 3, name: "d", },
        ];
        const links = [
            { sourceId: 0, targetId: 2 },
            { sourceId: 1, targetId: 2 },
            { sourceId: 2, targetId: 4 },
            { sourceId: 2, targetId: 3 },
        ];

        const graph = { nodes, links };

        const res = orderGraphNodes(graph as any).map((n: any) => n.name);
        expect(res.length).toEqual(5);
        expect(res.indexOf("a")).toBeLessThan(res.indexOf("c"));
        expect(res.indexOf("b")).toBeLessThan(res.indexOf("c"));
        expect(res.indexOf("c")).toBeLessThan(res.indexOf("d"));
        expect(res.indexOf("c")).toBeLessThan(res.indexOf("e"));
    });

    it('should return the correct result from diamond shaped graph  #3', () => {
        //      a
        //     / \
        //     b  c
        //     \ /
        //      d

        const nodes = [
            { id: 3, name: "d", },
            { id: 1, name: "b", },
            { id: 2, name: "c", },
            { id: 0, name: "a", },
        ];
        const links = [
            { sourceId: 0, targetId: 1 },
            { sourceId: 0, targetId: 2 },
            { sourceId: 1, targetId: 3 },
            { sourceId: 2, targetId: 3 },
        ];

        const graph = { nodes, links };

        const res = orderGraphNodes(graph as any).map((n: any) => n.name);
        expect(res.length).toEqual(4);
        expect(res.indexOf("a")).toBeLessThan(res.indexOf("b"));
        expect(res.indexOf("a")).toBeLessThan(res.indexOf("c"));
        expect(res.indexOf("b")).toBeLessThan(res.indexOf("d"));
        expect(res.indexOf("c")).toBeLessThan(res.indexOf("d"));
    });

    it('should return the correct result from complex shaped graph #4', () => {
        //      a b
        //      |/|
        //      c d
        //      | |
        //      | e
        //      | |
        //      f g

        const nodes = [
            { id: 4, name: "e", },
            { id: 1, name: "b", },
            { id: 5, name: "f", },
            { id: 6, name: "g", },
            { id: 2, name: "c", },
            { id: 0, name: "a", },
            { id: 3, name: "d", },
        ];
        const links = [
            { sourceId: 3, targetId: 4 },
            { sourceId: 4, targetId: 6 },
            { sourceId: 0, targetId: 2 },
            { sourceId: 1, targetId: 2 },
            { sourceId: 1, targetId: 3 },
            { sourceId: 2, targetId: 5 },
        ];

        const graph = { nodes, links };

        const res = orderGraphNodes(graph as any).map((n: any) => n.name);
        expect(res.indexOf("a")).toBeLessThan(res.indexOf("c"));
        expect(res.indexOf("b")).toBeLessThan(res.indexOf("c"));
        expect(res.indexOf("b")).toBeLessThan(res.indexOf("d"));
        expect(res.indexOf("c")).toBeLessThan(res.indexOf("f"));
        expect(res.indexOf("d")).toBeLessThan(res.indexOf("e"));
        expect(res.indexOf("e")).toBeLessThan(res.indexOf("g"));
    });

    fit('should return the correct result from complex shaped graph #4.1', () => {
        //      a 
        //     /|\
        //    b c d
        //    | | |
        //    | e |
        //     \|/
        //      f

        const nodes = [
            { id: 3, name: "d", },
            { id: 1, name: "b", },
            { id: 0, name: "a", },
            { id: 4, name: "e", },
            { id: 5, name: "f", },
            { id: 2, name: "c", },
        ];
        
        const links = [
            { sourceId: 0, targetId: 1 },
            { sourceId: 0, targetId: 2 },
            { sourceId: 0, targetId: 3 },
            { sourceId: 1, targetId: 5 },
            { sourceId: 2, targetId: 4 },
            { sourceId: 3, targetId: 5 },
            { sourceId: 4, targetId: 5 },
        ];

        const graph = { nodes, links };

        const res = orderGraphNodes(graph as any).map((n: any) => n.name);
        expect(res.indexOf("a")).toBeLessThan(res.indexOf("b"));
        // expect(res.indexOf("a")).toBeLessThan(res.indexOf("c"));
        // expect(res.indexOf("a")).toBeLessThan(res.indexOf("d"));
        // expect(res.indexOf("b")).toBeLessThan(res.indexOf("f"));
        // expect(res.indexOf("c")).toBeLessThan(res.indexOf("e"));
        // expect(res.indexOf("d")).toBeLessThan(res.indexOf("f"));    
        // expect(res.indexOf("e")).toBeLessThan(res.indexOf("f"));
    }); 

    it('should return the correct result from complex shaped graph #5', () => {
        //      a b
        //      |/|
        //      c d
        //      | |
        //      | e
        //      | |\
        //      f g i
        //      |/
        //      h

        const nodes = [
            { id: 0, name: "a", },
            { id: 1, name: "b", },
            { id: 2, name: "c", },
            { id: 3, name: "d", },
            { id: 4, name: "e", },
            { id: 5, name: "f", },
            { id: 6, name: "g", },
            { id: 7, name: "h", },
            { id: 8, name: "i", },
        ];
        const links = [
            { sourceId: 0, targetId: 2 },
            { sourceId: 1, targetId: 2 },
            { sourceId: 1, targetId: 3 },
            { sourceId: 2, targetId: 5 },
            { sourceId: 3, targetId: 4 },
            { sourceId: 4, targetId: 6 },
            { sourceId: 5, targetId: 7 },
            { sourceId: 6, targetId: 7 },
            { sourceId: 4, targetId: 8 },
        ];

        const graph = { nodes, links };

        const res = orderGraphNodes(graph as any).map((n: any) => n.name);
        expect(res.indexOf("a")).toBeLessThan(res.indexOf("c"));
        expect(res.indexOf("b")).toBeLessThan(res.indexOf("c"));
        expect(res.indexOf("b")).toBeLessThan(res.indexOf("d"));
        expect(res.indexOf("c")).toBeLessThan(res.indexOf("f"));
        expect(res.indexOf("d")).toBeLessThan(res.indexOf("e"));
        expect(res.indexOf("e")).toBeLessThan(res.indexOf("g"));
        expect(res.indexOf("f")).toBeLessThan(res.indexOf("h"));
        expect(res.indexOf("g")).toBeLessThan(res.indexOf("h"));
    });

    
});
