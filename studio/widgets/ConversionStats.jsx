import React, { useEffect, useState } from 'react';
import { Card, Heading, Stack, Box, Text, Flex } from '@sanity/ui';
import { client } from '../sanity.config';

export function ConversionStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `{
      "byService": *[_type == "lead"] {
        "services": selectedServices[]->name
      },
      "byPack": *[_type == "lead"] {
        selectedPack
      },
      "byBudget": *[_type == "lead"] {
        budget
      },
      "byTimeline": *[_type == "lead"] {
        timeline
      }
    }`;

    client
      .fetch(query)
      .then((data) => {
        // Process services
        const serviceCount = {};
        data.byService.forEach((lead) => {
          lead.services?.forEach((service) => {
            serviceCount[service] = (serviceCount[service] || 0) + 1;
          });
        });

        // Process packs
        const packCount = {};
        data.byPack.forEach((lead) => {
          if (lead.selectedPack) {
            packCount[lead.selectedPack] = (packCount[lead.selectedPack] || 0) + 1;
          }
        });

        // Process budgets
        const budgetCount = {};
        data.byBudget.forEach((lead) => {
          if (lead.budget) {
            budgetCount[lead.budget] = (budgetCount[lead.budget] || 0) + 1;
          }
        });

        // Process timelines
        const timelineCount = {};
        data.byTimeline.forEach((lead) => {
          if (lead.timeline) {
            timelineCount[lead.timeline] = (timelineCount[lead.timeline] || 0) + 1;
          }
        });

        setStats({
          services: Object.entries(serviceCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5),
          packs: Object.entries(packCount).sort((a, b) => b[1] - a[1]),
          budgets: Object.entries(budgetCount).sort((a, b) => b[1] - a[1]),
          timelines: Object.entries(timelineCount).sort((a, b) => b[1] - a[1]),
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching conversion stats:', error);
        setLoading(false);
      });
  }, []);

  const renderStatList = (title, items, emoji) => {
    if (!items || items.length === 0) return null;

    const total = items.reduce((sum, [, count]) => sum + count, 0);

    return (
      <Box>
        <Text size={1} weight="semibold" style={{ marginBottom: '8px', display: 'block' }}>
          {emoji} {title}
        </Text>
        <Stack space={2}>
          {items.map(([name, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <Flex key={name} align="center" gap={2}>
                <Box flex={1}>
                  <Text size={1}>{name}</Text>
                </Box>
                <Box style={{ width: '60px' }}>
                  <Flex align="center" gap={2}>
                    <Text size={1} weight="semibold">
                      {count}
                    </Text>
                    <Text size={1} muted>
                      ({percentage.toFixed(0)}%)
                    </Text>
                  </Flex>
                </Box>
                <Box flex={1} style={{ maxWidth: '100px' }}>
                  <div
                    style={{
                      height: '6px',
                      background: '#e0e0e0',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      </Box>
    );
  };

  if (loading) {
    return (
      <Card padding={4}>
        <Heading size={2}>📈 Statistiques de Conversion</Heading>
        <Box marginTop={3}>
          <Text>Chargement...</Text>
        </Box>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card padding={4}>
        <Heading size={2}>📈 Statistiques de Conversion</Heading>
        <Box marginTop={3}>
          <Text>Erreur de chargement</Text>
        </Box>
      </Card>
    );
  }

  return (
    <Card padding={4}>
      <Heading size={2}>📈 Statistiques de Conversion</Heading>

      <Stack space={4} marginTop={4}>
        {renderStatList('Services Populaires', stats.services, '⭐')}
        {renderStatList('Packs Choisis', stats.packs, '📦')}
        {renderStatList('Budgets', stats.budgets, '💰')}
        {renderStatList('Délais', stats.timelines, '⏰')}
      </Stack>
    </Card>
  );
}

export default ConversionStats;
