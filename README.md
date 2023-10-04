Assignment 4 - Creative Coding: Interactive Multimedia Experiences
===

## Graphs - Ansel Chang

Link: [link]

Ironically, the goal of this application was not to code nodes and edges. Instead, this project served as a testing bed for developing a custom MVC-based extensible framework in Angular for arbitrary interactable entities stored in fully decoupled models, which are injected into components (views), and are linked by interactors (controllers) that update models based on mouse interaction. The framework features full support for dragging, single-selection, multi-selection, context menus, click-capture modals, and keyboard input, where a central state machine distributes relevant events that are consumed by model-specific Interactors, all fully configurable for arbitrary actions from those events. Because models have no dependencies, it is trivial to implement serialization on top of them, allowing for undo/redo and save/load, where this submission demonstrates a simple save-to-server implementation featuring permanent randomly-generated URLs for saves.

A future goal is to build on this framework for complex applications that require models that may not necessarily have 1:1 correlation with views, have many specialized mouse interaction behaviors, necessitate layered SVGs, and need optimized computation and efficient performance.

The view layer stores no state, and realize their configuration based on the injected models. The graph component dynamically creates Node and Edge components based on the list of Node and Edge models, allowing for high cohesion for each component. In this project, HTML templates for components consist entirely of nested SVGs.

For the controller layer, Interactors for nodes, edges, and SVGs subclass the generic Interactor class, and handle the consumption of mouse events through the InteractionDervice, which are sent to the InteractionService state machine for central processing, where the the events are converted into useful selection and and drag events and sent back to the relevant Interactors through RxJS subjects for maximum flexibility. Thus, programmers can specify behaviors for each event for each component. Interactors also handle keyboard input and the configuration of customizable context menus.

The model layer is the simplest in this submission, as the purpose for this codebase is a fully model-agnostic framework. In this case, I represent the Graph through a Graph class and lists of Nodes and Edges. It is fully serializable, and saves are sent to the server on each MAJOR change. It's important to note that saves are sent while entities are being dragged, which would be woefully expensive - only at the end of the drag.

One highlight of this project is authentication-less saving. Upon modifying the base graph, a random URL is automatically generated, where internally, the server stores a map between the graph URL and the graph data. The URL thus serves as a permanent save for the graph, and successive modifications to the graph are still saved to the same URL. This makes sharing and collaborating making graphs very easy, though realtime multi-user editing is not supported.

I faced many challenges in designing this framework. Early versions did not have a controller layer, and I struggled between architectures that had either the components or the models handle mouse interaction. I was able to come to this conclusion by unwavering in the thought that the simple models could not be polluted by mouse interaction logic.

I am still quite a novice in Angular, never having worked with things like Directives, abstract components, and URL manipulation before. Through finding solutions for design flaws, I was forced to learn new Angular concepts to complete key pieces of the framework.

This framework is not without its flaws. One big design flaw that I have not been able to resolve is that the model does not have any direct way of accessing an Interactor that references it. This is worsened by the fact that, upon the creation of a model object, the associated Component, and therefore the Interactor, is not immediately created because control must be yielded back to Angular to detect the change and create the new component. This means that, upon creating a Node model, for example, there is no easy way to select the Node that was just created, as selection state is purely handled by NodeInteractor.