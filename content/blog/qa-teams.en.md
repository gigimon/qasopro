---
title: "QA Team Organization"
date: 2026-04-15
category: "Management"
dateLabel: "April 15, 2026"
lead: "Ways to organize QA across teams"
image: "/images/blog/qa-teams.png"
---

In my practice, I have encountered various ways of organizing the work of QA specialists across teams, but it usually boils down to a few methods, regardless of how development teams are structured in the company (cross-functional, specialized, etc.).

## QA Specialist Inside the Team

In large companies, when there are many roughly identical development teams (after all, we know that having more than 7-8 people in one team doesn't work well anymore), 1-2 QA specialists are very often added to the team (we won't separate manual, automators, SDETs), who deal entirely with testing the tasks of this team. Let's look at the pros and cons:

### Pros
- QAs become a center of knowledge and know their part of the project well
- the team knows who to approach regarding testing

### Cons
- bus factor is very high, because there are no more than 1-2 QAs in a small team
- it is not scalable, which can make QA a bottleneck
- QAs become the sole bearers of unique knowledge
- QAs start to get fatigued if the team develops functionality in only one area, leading to tunnel vision
- each team has its own testing rules


## External QA Team

Sometimes, the entire QA is moved into a separate department that simply receives tasks from development teams, distributes them among themselves, and executes them. 

### Pros
- scalability - more people in an external team can join in to test and tackle a problem, or cover for someone who left
- knowledge of all parts of the project is evenly distributed among all QAs (provided that tasks are always handled by different people)
- you can always shift the focus of tasks for a specific specialist, which can relieve the fatigue from routine
- unified testing rules

### Cons
- QAs have a less deep understanding of the narrow details of each development team
- testing responsibility is blurred across everyone (complicating communication when problems arise)


## Hybrid

Both classic ways of organizing QA in teams have a right to exist, but it is always necessary to be flexible and improve your processes. In a company with more than 10 development teams (in a product company), we eventually arrived at a hybrid model. 

We had a separate QA team with fewer specialists than development teams, but each specialist was assigned a few development teams. They had to attend their planning and grooming sessions to stay updated. Every 2 sprints, the specialists would swap (rotate); this prevented burnout, broadened their horizons, and helped build connections with different teams. Meanwhile, tasks still flowed into a shared pool (in Jira, they were simply moved to QA Pending), where an available QA could pick them up and test, regardless of who it was from. 

This solution helped resolve issues with knowledge transfer between specialists (everyone knew the product to some extent), bus factor problems (if someone went on vacation, testing in a team wouldn't halt), and the guys always had new and interesting tasks. Also, since there were always tasks, the workload was distributed evenly among everyone, eliminating situations where one person is swamped while another (in a different team) is idling and cannot help (due to poor inter-team communication or not understanding the other team's tasks).

Having changed jobs, I built a similar process from scratch, and over the course of 3 years with 50 developers (and 7 QAs), this approach once again proved to be highly viable.
