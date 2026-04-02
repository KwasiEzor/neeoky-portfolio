import React, { useEffect, useState } from 'react';
import { Card, Heading, Stack, Box, Text, Flex, Badge } from '@sanity/ui';
import { client } from '../sanity.config';

export function LeadsOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `{
      "total": count(*[_type == "lead"]),
      "new": count(*[_type == "lead" && status == "new"]),
      "in_progress": count(*[_type == "lead" && status == "in_progress"]),
      "contacted": count(*[_type == "lead" && status == "contacted"]),
      "quoted": count(*[_type == "lead" && status == "quoted"]),
      "converted": count(*[_type == "lead" && status == "converted"]),
      "archived": count(*[_type == "lead" && status == "archived"]),
      "today": count(*[_type == "lead" && _createdAt > $today]),
      "this_week": count(*[_type == "lead" && _createdAt > $week]),
      "this_month": count(*[_type == "lead" && _createdAt > $month])
    }`;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const week = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const month = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    client
      .fetch(query, { today, week, month })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching stats:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card padding={4}>
        <Heading size={2}>📊 Vue d'ensemble</Heading>
        <Box marginTop={3}>
          <Text>Chargement...</Text>
        </Box>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card padding={4}>
        <Heading size={2}>📊 Vue d'ensemble</Heading>
        <Box marginTop={3}>
          <Text>Erreur de chargement</Text>
        </Box>
      </Card>
    );
  }

  const statCards = [
    { label: 'Total', value: stats.total, emoji: '📋', color: 'blue' },
    { label: 'Nouveau', value: stats.new, emoji: '🆕', color: 'purple' },
    { label: 'En cours', value: stats.in_progress, emoji: '👀', color: 'yellow' },
    { label: 'Contacté', value: stats.contacted, emoji: '📞', color: 'cyan' },
    { label: 'Devis envoyé', value: stats.quoted, emoji: '💰', color: 'orange' },
    { label: 'Converti', value: stats.converted, emoji: '✅', color: 'green' },
  ];

  const timeStats = [
    { label: 'Aujourd\'hui', value: stats.today },
    { label: 'Cette semaine', value: stats.this_week },
    { label: 'Ce mois', value: stats.this_month },
  ];

  return (
    <Card padding={4}>
      <Heading size={2}>📊 Vue d'ensemble des Leads</Heading>

      <Stack space={4} marginTop={4}>
        {/* Status stats */}
        <Box>
          <Text size={1} weight="semibold" style={{ marginBottom: '12px', display: 'block' }}>
            Par Statut
          </Text>
          <Flex gap={3} wrap="wrap">
            {statCards.map((stat) => (
              <Card
                key={stat.label}
                padding={3}
                radius={2}
                shadow={1}
                style={{ flex: '1 1 calc(33.333% - 12px)', minWidth: '140px' }}
              >
                <Flex align="center" gap={2}>
                  <Text size={4}>{stat.emoji}</Text>
                  <Stack space={1} flex={1}>
                    <Text size={1} muted>
                      {stat.label}
                    </Text>
                    <Text size={3} weight="bold">
                      {stat.value}
                    </Text>
                  </Stack>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Box>

        {/* Time stats */}
        <Box>
          <Text size={1} weight="semibold" style={{ marginBottom: '12px', display: 'block' }}>
            Activité Récente
          </Text>
          <Flex gap={3} wrap="wrap">
            {timeStats.map((stat) => (
              <Card
                key={stat.label}
                padding={3}
                radius={2}
                tone="primary"
                style={{ flex: '1', minWidth: '120px' }}
              >
                <Stack space={1}>
                  <Text size={1} muted>
                    {stat.label}
                  </Text>
                  <Text size={3} weight="bold">
                    {stat.value}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Flex>
        </Box>

        {/* Conversion rate */}
        {stats.total > 0 && (
          <Box>
            <Card padding={3} radius={2} tone="positive">
              <Flex align="center" gap={2}>
                <Text size={3}>📈</Text>
                <Stack space={1} flex={1}>
                  <Text size={1} muted>
                    Taux de conversion
                  </Text>
                  <Text size={3} weight="bold">
                    {((stats.converted / stats.total) * 100).toFixed(1)}%
                  </Text>
                </Stack>
              </Flex>
            </Card>
          </Box>
        )}
      </Stack>
    </Card>
  );
}

export default LeadsOverview;
